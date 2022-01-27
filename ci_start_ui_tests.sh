#!/usr/bin/env sh
# set headless mode for browsers
sed -i "s/headless: false/headless: true/g" tests/config.js
# install dependencies
echo "install dependencies"
npm i
# Synchronization with backend for mock
echo "Synchronization with backend for mock"
export BABEL_ENV=test
export NODE_ENV=test
cd tests/mockServer/
node --require @babel/register backendSynchronizator.js
cd ../..
# setup mock endpoints
printf "REACT_APP_MLRUN_API_URL=http://localhost:30000/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com\n\
REACT_APP_NUCLIO_API_URL=http://localhost:30000/nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com\n\
REACT_APP_IGUAZIO_API_URL=http://localhost:30000/platform-api.default-tenant.app.vmdev36.lab.iguazeng.com\n\
REACT_APP_NUCLIO_UI_URL=http://localhost:8070\n\
REACT_APP_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com/mlrun/functions/master\n" > .env.development.local
# start UI test run
echo "start UI test run"
npm run start:regression


