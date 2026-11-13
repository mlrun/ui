## Production

### `npm run docker`

Builds a production Docker image.

You can pass the following environment variables to control the resulting image name:

| Name                    | Description                | Default     | Example             |
| ----------------------- | -------------------------- | ----------- | ------------------- |
| `MLRUN_DOCKER_REGISTRY` | sets the Docker registy    | (Dockerhub) | `quay.io/`          |
| `MLRUN_DOCKER_REPO`     | sets the Docker repository | `mlrun`     | `iguazio`           |
| `MLRUN_DOCKER_TAG`      | sets the Docker image tag  | `latest`    | `0.4.9`, `unstable` |

Note: the trailing forward-slash `/` in `MLRUN_DOCKER_REGISTRY`'s value is significant.

Examples:

| Command                                                                                          | Resulting Docker image name      |
| ------------------------------------------------------------------------------------------------ | -------------------------------- |
| `npm run docker`                                                                                 | `mlrun/mlrun-ui:latest`          |
| `MLRUN_DOCKER_REGISTRY=quay.io/ MLRUN_DOCKER_REPO=iguazio MLRUN_DOCKER_TAG=0.4.9 npm run docker` | `quay.io/iguazio/mlrun-ui:0.4.9` |

### `docker run` environment variables

The Docker container runs a Nginx server, which listens on exposed port number 8090, serves the web-app, and proxies to the backend API.

You can pass the following environment variables to the `docker run` command to configure it:

| Name                          | Description                                                                                                            |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `MLRUN_API_PROXY_URL`         | Sets the base URL of the backend API<br />Default: `http://localhost:8090`<br />Example: `http://17.220.101.245:30080` |
| `MLRUN_NUCLIO_MODE`           | Sets the MLRun Nuclio integration mode<br />Default: `disabled`<br />Example: `enabled`                                |
| `MLRUN_NUCLIO_API_URL`        | Sets the base URL of the Nuclio API<br />Default: `http://localhost:8070`<br />Example: `http://17.220.101.245:30070`  |
| `MLRUN_NUCLIO_UI_URL`         | Sets the base URL of the Nuclio UI<br />Default: `http://localhost:8070`<br />Example: `http://17.220.101.245:30070`   |
| `MLRUN_FUNCTION_CATALOG_URL`  | Sets the base URL of the function-template catalog <br />Default: `https://raw.githubusercontent.com`                  |
| `MLRUN_FUNCTION_CATALOG_PATH` | Sets the base URI of the function-template catalog <br />Default: `/mlrun/functions/master`                            |
| `MLRUN_IGZ_UI_ALLOWED_ORIGIN` | Allowed origin for Module Federation and CORS<br />Example: `https://someorigin.com`                                   |

Example:

`docker run -it -d -p 8090:8090 --rm --name mlrun-ui -e MLRUN_API_PROXY_URL=http://17.220.101.245:30080 -e MLRUN_NUCLIO_MODE=enabled -e MLRUN_NUCLIO_API_URL=http://17.220.101.245:30070 -e MLRUN_NUCLIO_UI_URL=http://17.220.101.245:30070 -e MLRUN_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com -e MLRUN_FUNCTION_CATALOG_PATH=/mlrun/functions/master quay.io/mlrun/mlrun-ui:0.4.9`

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

### `npm run preview:federation`

Builds and serves the **mlrun-ui** application in **Module Federation** mode at `http://localhost:5179/`.<br />
Use this command when developing locally with **igz-ui**, allowing **mlrun-ui** to be consumed as a remote module.

The remote exposes `./app` and `./loadRemoteConfig`. Their TypeScript types are generated on every build (and kept in sync
while the dev server runs) into `build/@mf-types`, `build/@mf-types.d.ts` and `build/@mf-types.zip`, using the `tsconfig.json` in the repo root.

## Development

### Environment variables

All environment variables from production (described [here](#docker-run-environment-variables)) are expanded to environment variables that could be used in development, via **.env.production** file.
In order to override them, add a **.env.development** file next to **.env.production** file and override the desired variables.
For example:

```
VITE_MLRUN_API_URL=http://3.129.154.119:30080
VITE_NUCLIO_API_URL=http://localhost:8070
VITE_NUCLIO_UI_URL=http://localhost:8070
VITE_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com/mlrun/functions/master
```

### Dev server proxy

`npm start` and `npm run preview:federation` proxy requests from the dev server to the backends configured in your `.env.development`
(see `vite.config.mjs`). A proxy entry is created only when its variable is set; unset variables are skipped.

| Request prefix      | Target variable             | Prefix stripped before forwarding |
| ------------------- | --------------------------- | --------------------------------- |
| `/api`              | `VITE_MLRUN_API_URL`        | No                                |
| `/nuclio`           | `VITE_NUCLIO_API_URL`       | Yes                               |
| `/iguazio`          | `VITE_IGUAZIO_API_URL`      | Yes                               |
| `/function-catalog` | `VITE_FUNCTION_CATALOG_URL` | Yes                               |

- All proxies use `changeOrigin: true` and `secure: false` (self-signed certificates are accepted).
- `/api` also sends `x-remote-user: admin` and, when `VITE_MLRUN_V3IO_ACCESS_KEY` is set, `x-v3io-session-key`.
- To add a backend, add one `...proxyEntry('/prefix', env.VITE_..._URL, { stripPrefix: true })` line to `server.proxy` in `vite.config.mjs`.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Note: `npm install` should be run first.

## E2E regression

The Gherkin scenarios in `tests/features/*.feature` run in Chromium by [Playwright Test](https://playwright.dev) via
[playwright-bdd](https://vitalets.github.io/playwright-bdd): `bddgen` generates the Playwright specs into `.features-gen`,
the steps are in `tests/features/step-definitions`.

Install the browser once: `npx playwright install chromium` (on CI: `npx playwright install --with-deps chromium`).

One command runs the regression, locally and on CI. It builds the app (`build:regression`, a few seconds), generates
the specs, runs the scenarios headless against the app and the mock server (Playwright starts both) and generates the
Allure report. The settings are environment variables, the arguments after `--` are passed to Playwright:

```bash
npm run test:regression
E2E_WORKERS=3 E2E_RETRIES=2 npm run test:regression -- --grep "MLPr001 |MLA016 " --repeat-each 3
npm run test:regression:ci
```

| Command                          | Description                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run test:regression`        | The regression with a progress bar, then the Allure report is generated and served (`E2E_OPEN_REPORT=false` - not served)                                                                  |
| `npm run test:regression:ci`     | The same for CI (`CI=true`): `.only` and flaky scenarios fail the run, no servers are reused, the report isn't served, the workers default to half of the CPUs, GitHub Actions annotations |
| `npm run test:regression:failed` | The scenarios failed in the previous run (one worker)                                                                                                                                      |
| `npm run test:regression:debug`  | Playwright UI mode against the dev server: pick scenarios, watch them step by step, time-travel                                                                                            |
| `npm run report:open`            | Open the Allure report: every attempt of a scenario with its error, screenshot and trace, history of runs                                                                                  |

| Environment variable  | Description                                                                                                                                                                                            | Default                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| `E2E_WORKERS`         | Scenarios run in parallel: N processes, each with its own mock server and app (one build), on `E2E_APP_PORT`/`E2E_MOCK_PORT` + 1..N                                                                    | `1`, on CI half of the CPUs |
| `E2E_FULL_PER_WORKER` | `true` - every worker runs the whole regression, not a share of it (e.g. `E2E_WORKERS=3` runs it 3 times at once to find the flaky scenarios); the report shows the runs of a scenario as its attempts | `false`                     |
| `E2E_MAX_WORKERS`     | Upper limit of `E2E_WORKERS` (every worker is a mock server, an app server and a browser)                                                                                                              | `4`                         |
| `E2E_RETRIES`         | Retries of a failed scenario (0..5), a scenario passed on a retry is reported as flaky                                                                                                                 | `1`                         |
| `E2E_TRACE`           | Playwright trace: `on-first-retry` (only the retry of a failed scenario, a passing one records nothing), `retain-on-failure` (every attempt), `on`, `off`...                                           | `on-first-retry`            |
| `E2E_APP`             | `build` - the prebuilt app (~190 MB, ~60 requests per page load), `dev` - the dev server (~2 GB, ~530 requests)                                                                                        | `build`                     |
| `E2E_BUILD`           | `false` - don't rebuild the app, run against the existing `build/regression`                                                                                                                           | `true`                      |
| `E2E_HEADLESS`        | `false` - show the browser                                                                                                                                                                             | `true`                      |
| `E2E_TAGS`            | Tag expression, e.g. `@smoke and not @inProgress`                                                                                                                                                      | all                         |
| `E2E_TZ`              | Timezone of the browser and of the steps                                                                                                                                                               | `UTC`                       |
| `E2E_LOCALE`          | Locale of the browser (number and date formats)                                                                                                                                                        | `en-US`                     |
| `E2E_OPEN_REPORT`     | `false` - don't serve the report after the run (it isn't served on CI)                                                                                                                                 | `true`                      |
| `E2E_APP_PORT`        | Port of the app, e.g. to run next to another app on the default port                                                                                                                                   | `3000`                      |
| `E2E_MOCK_PORT`       | Port of the mock server, the app proxies the API requests to it                                                                                                                                        | `30000`                     |

A wrong value fails the run before anything is started. An app or a mock server already running on the ports of the run
is reused (not on CI), the run warns about it: the scenarios run against it, not against the build of the run.

Only one E2E run is active at a time (the lock file `tests/reports/.e2e-run.lock`): every run starts an app, a mock server
and a browser, so runs in parallel exhaust the memory. Parallel runs (`E2E_WORKERS` > 1) can be started only by a person
from an interactive terminal (or on CI), a start from a script or an agent is refused. If another run is in progress, a
person is asked whether to stop it (with its servers and browsers) and start the new one; a non-interactive start is
refused until the running one ends. A lock of a dead process is taken over.

### Mock server

The scenarios of a worker run one at a time: they share the mock server. Before every scenario its process is
restarted (`npm run mock-server` supervises it, `POST /reset-mock-state`), so a scenario starts on a clean state and
the memory doesn't grow over the run (~110 MB, ~0.25 s per restart).

The big `auto-generated-data` project (`tests/mockServer/dataGenerators.js`: 2700 runs, 1200 alerts, models with LLM
prompts) is generated only for the scenarios tagged `@generatedData` (paging, search over many items). Tag a scenario that
needs it. To start the mock server with it manually: `MOCK_GENERATED_DATA=true npm run mock-server`.

The scenarios tagged `@knownBug` or `@FAILED_TODO` are expected to fail: their failure doesn't fail the run, the console
shows them as known bugs (◆) and the report as failed and known ("accepted", in the "Known app bugs" and "Not implemented
yet" categories). Such a scenario that passes fails the run: remove the tag.
A scenario that passes only on a retry is reported as flaky, on CI it fails the run.
