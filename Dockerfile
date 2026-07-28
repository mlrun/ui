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
    sed -i "s|^VITE_PUBLIC_URL=/mlrun|VITE_PUBLIC_URL=|" .env.production && \
    echo ">>> Final .env.production:" && grep '^VITE_' .env.production

RUN npm run build

ARG COMMIT_HASH
ARG DATE
RUN echo "${COMMIT_HASH}" > ./build/COMMIT_HASH && \
    echo "${DATE}" > ./build/BUILD_DATE

# production stage
FROM gcr.io/iguazio/nginx-unprivileged:1.31.2-alpine3.23 AS production-stage

ARG UID=101
ARG GID=101
ARG IS_MF=false

USER root
# curl/libcurl are unused at runtime and the patched build (8.21.0-r0) is not yet
# published to the Alpine 3.23 repos, so remove them entirely to clear the CVEs
RUN apk update --no-cache && apk upgrade --no-cache \
 && apk del curl libcurl \
 && rm -f /etc/nginx/conf.d/default.conf

USER $UID

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/.env.production /usr/share/nginx/html/

COPY nginx/nginx.conf.tmpl /etc/nginx/conf.d/
COPY nginx/run_nginx /etc/nginx/

USER root
RUN if [ "$IS_MF" \
    = "true" ]; then \
      INDEX=/usr/share/nginx/html/index.html; \
      [ -f "$INDEX" ] && sed -i 's|<base href="/mlrun"|<base href="/projects"|g' "$INDEX"; \
    fi && \
    chown -R $UID:0 /usr/share/nginx/html && \
    chmod -R g+w /usr/share/nginx/html && \
    chmod 755 /etc/nginx/run_nginx

USER $UID

# flatten stage - collapses every layer of production-stage into one, so the
# removed curl/libcurl files leave no whiteout entries in the shipped image
FROM scratch AS flatten-stage
COPY --from=production-stage / /

ENV PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ARG UID=101
USER $UID

EXPOSE 8090

CMD ["/etc/nginx/run_nginx"]
