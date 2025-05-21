# Copyright 2019 Iguazio
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# build stage
FROM quay.io/mlrun/node:20.19.2-slim AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# build arg
ARG IS_MF=false

RUN echo ">>> IS_MF ARG = $IS_MF" && \
    sed -i "/^VITE_FEDERATION=/d" .env.production && \
    echo "VITE_FEDERATION=$IS_MF" >> .env.production && \
    if [ "$IS_MF" = "true" ]; then \
      sed -i 's|^VITE_PUBLIC_URL=.*|VITE_PUBLIC_URL=|' .env.production && \
      sed -i 's|^VITE_BASE_URL=.*|VITE_BASE_URL=|' .env.production ; \
    fi && \
    echo ">>> Final .env.production:" && grep '^VITE_' .env.production

RUN npm run build

ARG COMMIT_HASH
ARG DATE
RUN echo "${COMMIT_HASH}" > ./build/COMMIT_HASH && \
    echo "${DATE}" > ./build/BUILD_DATE

# production stage
FROM gcr.io/iguazio/nginx-unprivileged:1.21-alpine AS production-stage

# align UID & GID with nginx-unprivileged image UID & GID
ARG UID=101
ARG GID=101
ARG IS_MF=false

USER root
# escalate permissions to update packages
RUN apk update --no-cache && apk upgrade --no-cache
# we are inheriting $UID and $GID from the base image, you can find more information here:
# https://github.com/nginxinc/docker-nginx-unprivileged/blob/main/Dockerfile-alpine.template
USER $UID

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/.env.production /usr/share/nginx/html/

COPY config.json.tmpl /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf.tmpl /etc/nginx/conf.d/
COPY nginx/run_nginx /etc/nginx/

USER root
# update build files permissions so they would be accessible to the running user
RUN if [ "$IS_MF" \
    = "true" ]; then \
      INDEX=/usr/share/nginx/html/index.html; \
      [ -f "$INDEX" ] && sed -i 's|<base href="/mlrun"|<base href="/"|g' "$INDEX"; \
    fi && \
    chown -R $UID:0 /usr/share/nginx/html && \
    chmod -R g+w /usr/share/nginx/html && \
    chmod 777 /etc/nginx/run_nginx
USER $UID

EXPOSE 8090

ENV MLRUN_API_PROXY_URL="${MLRUN_API_PROXY_URL:-http://localhost:8090}" \
    MLRUN_BETA_MODE="${MLRUN_BETA_MODE:-enabled}" \
    MLRUN_FUNCTION_CATALOG_URL="${MLRUN_FUNCTION_CATALOG_URL:-https://raw.githubusercontent.com}" \
    MLRUN_FUNCTION_CATALOG_PATH="${MLRUN_FUNCTION_CATALOG_PATH:-/mlrun/functions/master}" \
    MLRUN_NUCLIO_API_URL="${MLRUN_NUCLIO_API_URL:-http://localhost:8070}" \
    MLRUN_NUCLIO_MODE="${MLRUN_NUCLIO_MODE:-disabled}" \
    MLRUN_NUCLIO_UI_URL="${MLRUN_NUCLIO_UI_URL:-http://localhost:8070}" \
    MLRUN_V3IO_ACCESS_KEY="${MLRUN_V3IO_ACCESS_KEY:-}" \
    MLRUN_IGZ_UI_ALLOWED_ORIGIN="${MLRUN_IGZ_UI_ALLOWED_ORIGIN:-http://localhost:8070}"

CMD echo resolver $(awk 'BEGIN{ORS=" "} $1=="nameserver" {print $2}' /etc/resolv.conf) ";" > /etc/nginx/resolvers.conf && /etc/nginx/run_nginx
