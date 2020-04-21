# build stage
FROM node:lts-alpine as build-stage

ARG COMMIT_HASH
ARG DATE

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN echo ${COMMIT_HASH} > ./build/COMMIT_HASH && \
    echo ${DATE} > ./build/BUILD_DATE

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf.tmpl /etc/nginx/conf.d/
EXPOSE 80

ENV MLRUN_API_PROXY_URL="${MLRUN_API_PROXY_URL:-http://localhost:80}"
ENV MLRUN_FUNCTION_CATALOG_URL="${MLRUN_FUNCTION_CATALOG_URL:-https://raw.githubusercontent.com/mlrun/functions/master/catalog.json}"

CMD ["/bin/sh", "-c", "envsubst '${MLRUN_API_PROXY_URL} ${MLRUN_FUNCTION_CATALOG_URL}' < /etc/nginx/conf.d/nginx.conf.tmpl > /etc/nginx/conf.d/nginx.conf && nginx -g 'daemon off;'"]
