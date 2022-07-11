# build stage
FROM quay.io/mlrun/node:14.18.1-alpine as build-stage

RUN apk update && \
	apk upgrade && \
	rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ARG COMMIT_HASH
ARG DATE
RUN echo ${COMMIT_HASH} > ./build/COMMIT_HASH && \
    echo ${DATE} > ./build/BUILD_DATE

# production stage
FROM gcr.io/iguazio/nginx-unprivileged:1.21-alpine as production-stage

USER root
# needs permissions to run these updates
RUN apk update --no-cache && apk upgrade --no-cache
USER $UID

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY config.json.tmpl /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf.tmpl /etc/nginx/conf.d/
COPY nginx/run_nginx /etc/nginx/

USER root
# because we are generating files at runtime, we need access to write and execute to the folders and files listed below
RUN chown -R $UID:0 /usr/share/nginx/html && chmod -R g+w /usr/share/nginx/html && chmod 777 /etc/nginx/run_nginx
USER $UID

EXPOSE 8090

ENV MLRUN_API_PROXY_URL="${MLRUN_API_PROXY_URL:-http://localhost:8090}" \
    MLRUN_BETA_MODE="${MLRUN_BETA_MODE:-enabled}" \
    MLRUN_FUNCTION_CATALOG_URL="${MLRUN_FUNCTION_CATALOG_URL:-https://raw.githubusercontent.com}" \
    MLRUN_FUNCTION_CATALOG_PATH="${MLRUN_FUNCTION_CATALOG_PATH:-/mlrun/functions/master}" \
    MLRUN_NUCLIO_API_URL="${MLRUN_NUCLIO_API_URL:-http://localhost:8070}" \
    MLRUN_NUCLIO_MODE="${MLRUN_NUCLIO_MODE:-disabled}" \
    MLRUN_NUCLIO_UI_URL="${MLRUN_NUCLIO_UI_URL:-http://localhost:8070}" \
    MLRUN_V3IO_ACCESS_KEY="${MLRUN_V3IO_ACCESS_KEY:-\"\"}"

CMD echo resolver $(awk 'BEGIN{ORS=" "} $1=="nameserver" {print $2}' /etc/resolv.conf) ";" > /etc/nginx/resolvers.conf && /etc/nginx/run_nginx
