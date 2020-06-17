## Production

### `npm run docker`

Builds a production Docker image.

You can pass the following environment variables to control the resulting image name:

- `MLRUN_DOCKER_REGISTRY`: sets the Docker registy, such as `quay.io/`. If omitted or empty Dockerhub will be used. Note: the trailing forward-slash `/` is significant.
- `MLRUN_DOCKER_REPO`: sets the Docker repository, such as `mlrun`. Defaults to `iguazio`.
- `MLRUN_DOCKER_TAG`: sets the Docker image tag, such as `latest` or `0.4.9`. Defaults to the short form of the current git commit hash (for example `a121e02`).

Examples:

- Commnad:
  ```
  npm run docker
  ```
  Resulting Docker image name:
  ```
  iguazio/mlrun-ui:a121e02
  ```
- Commnad:
  ```
  MLRUN_DOCKER_REGISTRY=quay.io/ MLRUN_DOCKER_REPO=mlrun MLRUN_DOCKER_TAG=0.4.9 npm run docker
  ```
  Resulting Docker image name:
  ```
  quay.io/mlrun/mlrun-ui:0.4.9
  ```
  

### `docker run` environment variables

The Docker image runs an Nginx server, which listens on exposed port number 80 and serves the web-app.
You can pass the following environment variables on running the Docker image:

- `MLRUN_API_PROXY_URL`: sets the base URL of the backend API, such as `http://17.220.101.245:30080`. Defaults to `http://localhost:80`.
- `MLRUN_V3IO_ACCESS_KEY`: sets the V3IO access key to use for accessing V3IO containers, such as `a7097c94-6e8f-436d-9717-a84abe2861d1`.
- `MLRUN_FUNCTION_CATALOG_URL`: sets the base URL of the function-template catalog, such as `https://raw.githubusercontent.com/mlrun/functions/master`. It assumes a `catalog.json` file resides in this root dir which have relative paths to function templates nested in this dir.

Example:

```
docker run -it -p 4000:80 --rm --name mlrun-ui -e MLRUN_API_PROXY_URL=http://17.220.101.245:30080 -e MLRUN_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com/mlrun/functions/master -e MLRUN_V3IO_ACCESS_KEY=a7097c94-6e8f-436d-9717-a84abe2861d1 quay.io/mlrun/mlrun-ui:0.4.9
```

## Development

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
