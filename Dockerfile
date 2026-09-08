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

RUN npm run build

ARG COMMIT_HASH
ARG DATE
RUN echo "${COMMIT_HASH}" > ./build/COMMIT_HASH && \
    echo "${DATE}" > ./build/BUILD_DATE

# production stage
FROM gcr.io/iguazio/nginx-unprivileged:1.31.2-alpine3.23 AS production-stage

ARG GIT_COMMIT_SHA
LABEL org.opencontainers.image.revision=$GIT_COMMIT_SHA

ARG UID=101
ARG GID=101

USER root
# curl/libcurl are unused at runtime and the patched build (8.21.0-r0) is not yet
# published to the Alpine 3.23 repos, so remove them entirely to clear the CVEs
RUN apk update --no-cache && apk upgrade --no-cache \
 && apk del curl libcurl \
 && rm -f /etc/nginx/conf.d/default.conf

USER $UID

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY config.json.tmpl /usr/share/nginx/html/

COPY nginx/nginx.conf.tmpl nginx/nginx-mf.conf.tmpl /etc/nginx/conf.d/
COPY nginx/run_nginx /etc/nginx/

USER root
RUN chown -R $UID:0 /usr/share/nginx/html && \
    chmod -R g+w /usr/share/nginx/html && \
    chmod 755 /etc/nginx/run_nginx

USER $UID

# flatten stage - collapses every layer of production-stage into one, so the
# removed curl/libcurl files leave no whiteout entries in the shipped image
FROM scratch AS flatten-stage
COPY --from=production-stage / /

ARG GIT_COMMIT_SHA
LABEL org.opencontainers.image.revision=$GIT_COMMIT_SHA

ENV PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ARG UID=101
USER $UID

EXPOSE 8090

# Runtime configuration, common to igz3, igz4 (Module Federation), and CE.
# Substituted into nginx.conf and config.json at container start (see
# nginx/run_nginx); MLRUN_IGZ_UI_ALLOWED_ORIGIN selects igz3/CE vs igz4.
ENV MLRUN_API_PROXY_URL="${MLRUN_API_PROXY_URL:-http://localhost:8090}" \
    MLRUN_BETA_MODE="${MLRUN_BETA_MODE:-enabled}" \
    MLRUN_FUNCTION_CATALOG_URL="${MLRUN_FUNCTION_CATALOG_URL:-https://raw.githubusercontent.com}" \
    MLRUN_FUNCTION_CATALOG_PATH="${MLRUN_FUNCTION_CATALOG_PATH:-/mlrun/functions/master}" \
    MLRUN_IGZ_UI_ALLOWED_ORIGIN="${MLRUN_IGZ_UI_ALLOWED_ORIGIN:-}" \
    MLRUN_NUCLIO_API_URL="${MLRUN_NUCLIO_API_URL:-http://localhost:8070}" \
    MLRUN_NUCLIO_MODE="${MLRUN_NUCLIO_MODE:-disabled}" \
    MLRUN_NUCLIO_UI_URL="${MLRUN_NUCLIO_UI_URL:-http://localhost:8070}" \
    MLRUN_V3IO_ACCESS_KEY="${MLRUN_V3IO_ACCESS_KEY:-\"\"}"

CMD ["/etc/nginx/run_nginx"]
