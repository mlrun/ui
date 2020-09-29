## Production

### `npm run docker`

Builds a production Docker image.

You can pass the following environment variables to control the resulting image name:

| Name  | Description | Default | Example |
| ----- | ----------- | ------- | ------- |
| `MLRUN_DOCKER_REGISTRY` | sets the Docker registy | (Dockerhub) | `quay.io/` |
| `MLRUN_DOCKER_REPO` | sets the Docker repository | `mlrun` | `iguazio` |
| `MLRUN_DOCKER_TAG` | sets the Docker image tag | `latest` | `0.4.9`, `unstable` |

Note: the trailing forward-slash `/` in `MLRUN_DOCKER_REGISTRY`'s value is significant.

Examples:

| Command  | Resulting Docker image name |
| ----- | ----------- |
| `npm run docker` | `mlrun/mlrun-ui:latest` |
| `MLRUN_DOCKER_REGISTRY=quay.io/ MLRUN_DOCKER_REPO=iguazio MLRUN_DOCKER_TAG=0.4.9 npm run docker` | `quay.io/iguazio/mlrun-ui:0.4.9` |

### `docker run` environment variables

The Docker container runs an Nginx server, which listens on exposed port number 80, serves the web-app, and proxies to the backend API.

You can pass the following environment variables to the `docker run` command to configure it:

| Name  | Description |
| ----- | ----------- |
| `MLRUN_API_PROXY_URL` | Sets the base URL of the backend API<br />Default: `http://localhost:80`<br />Example: `http://17.220.101.245:30080` |
| `MLRUN_NUCLIO_API_URL` | Sets the base URL of the Nuclio API<br />Default: `disabled`<br />Example: `http://17.220.101.245:30080` |
| `MLRUN_NUCLIO_UI_URL` | Sets the base URL of the Nuclio UI<br />Default: `disabled`<br />Example: `http://17.220.101.245:30080` |
| `MLRUN_V3IO_ACCESS_KEY` | Sets the V3IO access key to use for accessing V3IO containers<br />Example: `a7097c94-6e8f-436d-9717-a84abe2861d1` |
| `MLRUN_FUNCTION_CATALOG_URL` | Sets the base URL of the function-template catalog <br />Default: `https://raw.githubusercontent.com/mlrun/functions/master` |

Example:

`docker run -it -d -p 4000:80 --rm --name mlrun-ui -e MLRUN_API_PROXY_URL=http://17.220.101.245:30080 -e MLRUN_NUCLIO_API_URL=http://17.220.101.245:30081 -e MLRUN_NUCLIO_UI_URL=http://17.220.101.245:30081 -e MLRUN_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com/mlrun/functions/master -e MLRUN_V3IO_ACCESS_KEY=a7097c94-6e8f-436d-9717-a84abe2861d1 quay.io/mlrun/mlrun-ui:0.4.9`

### Docker container contents

The files served by Nginx server are located at `/usr/share/nginx/html` and consist of:

- The production deployment files coming from the `build` folder (created by the [`npm run build`](#npm-run-build) command in the Dockerflie).
- `BUILD_DATE`: a file that contains the timestamp of running the [`npm run docker`](#npm-run-docker) command, for example `Wed Jun 17 15:43:16 UTC 2020`.<br />
  In case the Docker container is running and is named `mlrun-ui`, you can use the following command to print the build date:
  ```
  $ docker exec -ti mlrun-ui sh -c "cat /usr/share/nginx/html/BUILD_DATE"
  Wed Jun 17 15:43:16 UTC 2020
  ```
- `COMMIT_HASH`: a file that contains the short git commit hash (for example: `703a554`) of the commit that was at the `HEAD` when running the [`npm run docker`](#npm-run-docker) command.<br />
  In case the Docker container is running and is named `mlrun-ui`, you can use the following command to print the short git commit hash:
  ```
  $ docker exec -ti mlrun-ui sh -c "cat /usr/share/nginx/html/COMMIT_HASH"
  703a554
  ```

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed.

This command is run by the Dockerfile that is used by the command [`npm run docker`](#npm-run-docker).

Note: `npm install` should be run first.

## Development

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Note: `npm install` should be run first.