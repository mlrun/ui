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

Gherkin scenarios (`tests/features/*.feature`, steps in `tests/features/step-definitions`) run in Chromium by
[Playwright Test](https://playwright.dev) via [playwright-bdd](https://vitalets.github.io/playwright-bdd), against the
built app and the mock server (`scripts/mockServer.js`). Playwright starts both.

Install the browser once: `npx playwright install chromium`.

```bash
npm run test:regression
E2E_WORKERS=3 npm run test:regression -- --grep "MLPr001 |MLA016 "
```

The run builds the app into `build`, generates the specs (`bddgen`), runs the scenarios and generates the Allure report.
Arguments after `--` go to Playwright. Run through the npm scripts, not `npx playwright test`: a direct run skips
`bddgen` and refuses a `build` that isn't an E2E build.

| Command                          | Description                                                                |
| -------------------------------- | -------------------------------------------------------------------------- |
| `npm run test:regression`        | All the scenarios, then the Allure report is served                        |
| `npm run test:regression:ci`     | The same in CI mode: flaky scenarios fail the run, the report isn't served |
| `npm run test:sanity`            | The `@sanity` scenarios (the PR selection of CI) with 3 workers            |
| `npm run test:regression:failed` | The scenarios that failed in the previous run                              |
| `npm run test:regression:debug`  | Playwright UI mode against the dev server                                  |
| `npm run test:defects`           | Breaks the mock server on purpose and checks that the scenarios fail       |
| `npm run report:open`            | Opens the Allure report                                                    |

| Environment variable | Description                                              | Default                     |
| -------------------- | -------------------------------------------------------- | --------------------------- |
| `E2E_WORKERS`        | Parallel Playwright workers                              | `1`, on CI half of the CPUs |
| `E2E_MAX_WORKERS`    | Upper limit of `E2E_WORKERS` (each worker is ~1 GB)      | `4`                         |
| `E2E_RETRIES`        | Retries of a failed scenario, a pass on a retry is flaky | `1`                         |
| `E2E_TAGS`           | Tag expression, e.g. `@smoke and not @inProgress`        | all                         |
| `E2E_HEADLESS`       | `false` - show the browser                               | `true`                      |
| `E2E_TRACE`          | Playwright trace mode                                    | `on-first-retry`            |
| `E2E_APP`            | `build` - the prebuilt app, `dev` - the dev server       | `build`                     |
| `E2E_BUILD`          | `false` - reuse the existing E2E build                   | `true`                      |
| `E2E_OPEN_REPORT`    | `false` - don't serve the report after the run           | `true`                      |
| `E2E_ALLURE`         | `false` - no Allure report, only the console             | `true`                      |
| `E2E_APP_PORT`       | Port of the app                                          | `3000`                      |
| `E2E_MOCK_PORT`      | Port of the mock server                                  | `30000`                     |

Only one run is active at a time (`tests/reports/.e2e-run.lock`). Runs with more than one worker start only from an
interactive terminal or on CI. Every worker has its own browser and its own mock server instance, reset before each
scenario, so the scenarios don't share state.

**Tags.**

- `@sanity`: the main check of a page or a flow, run on every PR. Keep them fast.
- `@knownBug`, `@FAILED_TODO`: never fail the run. A failure is shown as a known bug (◆), a pass as "known bug passed"
  (★). Use them for work that is out of scope for now, and remove the tag once it's fixed.
- `@generatedData`: the scenario needs the big generated project (paging, search over many items).
- `@demoMode`: demo mode, left out on CI.

### CI

`.github/workflows/e2e.yaml` runs `npm run test:regression:ci` on `ubuntu-latest` with 3 workers.

- **PRs** (non-draft, into `development`, `feature/**` and the release branches) run
  `@sanity and not @demoMode`. A new push cancels the running run.
- **Full regression** (`not @demoMode`) runs weekly on Thursday 03:00 UTC, and on demand from Actions →
  E2E regression → Run workflow (inputs `workers` 1-4 and `tags`).
- **Report.** The job summary lists the failed and flaky scenarios with their errors. The full regression uploads the
  `allure-report` artifact (serve it with `npx allure open <folder>`). A failed run uploads `e2e-test-results` with the
  traces and screenshots (`npx playwright show-trace <trace.zip>`).
