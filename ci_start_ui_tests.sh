#!/usr/bin/env sh
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
# Runs the E2E regression in a Debian/Ubuntu based image with Node.js 24,
# e.g. mcr.microsoft.com/playwright (the browser and its system dependencies are already installed there)
set -e

echo "install dependencies"
npm ci
# no-op when the image already has the browser of the installed Playwright version
npx playwright install --with-deps chromium
# setup mock endpoints
printf "VITE_MLRUN_API_URL=http://localhost:30000/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com\n\
VITE_NUCLIO_API_URL=http://localhost:30000/nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com\n\
VITE_IGUAZIO_API_URL=http://localhost:30000/platform-api.default-tenant.app.vmdev36.lab.iguazeng.com\n\
VITE_NUCLIO_UI_URL=http://localhost:8070\n\
VITE_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com/mlrun/functions/master\n" > .env.development.local
# start UI test run: Playwright starts the mock server and the app itself (`webServer` in playwright.config.js)
echo "start UI test run"
CI=true E2E_HEADLESS=true npm run test:regression
