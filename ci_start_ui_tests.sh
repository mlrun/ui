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
# install google-chrome and utilites
yum update -y
yum install -y screen
curl https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm -o google-chrome-stable_current_x86_64.rpm
yum install google-chrome-stable_current_x86_64.rpm -y
# set headless mode for browsers
sed -i "s/headless: false/headless: true/g" tests/config.js
# install dependencies
echo "install dependencies"
npm i
# setup mock endpoints
printf "REACT_APP_MLRUN_API_URL=http://localhost:30000/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com\n\
REACT_APP_NUCLIO_API_URL=http://localhost:30000/nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com\n\
REACT_APP_IGUAZIO_API_URL=http://localhost:30000/platform-api.default-tenant.app.vmdev36.lab.iguazeng.com\n\
REACT_APP_NUCLIO_UI_URL=http://localhost:8070\n\
REACT_APP_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com/mlrun/functions/master\n" > .env.development.local
# start UI test run
echo "start UI test run"
screen -dm npm run mock-server
screen -dm npm start
npm run test:regression
pkill screen
