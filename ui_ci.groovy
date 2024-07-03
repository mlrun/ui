@Library('pipelinex@development')
import com.iguazio.pipelinex.JobException

def node_label = 'ubuntu-ui-runner'

common.set_current_display_name("UI_CI_Test")

common.main {
    timestamps {
        nodes.runner(node_label) {
            stage('UI CI Test') {

                common.conditional_stage('Pull Latest Changes', true) {
                    checkout scm
                    sh 'git pull'
                }

                common.conditional_stage('Set up Environment', true) {
                    sh 'npm install'
                    sh '''
                        export REACT_APP_FUNCTION_CATALOG_URL=https://raw.githubusercontent.com/mlrun/functions/master
                        export REACT_APP_MLRUN_API_URL=http://localhost:30000/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com
                        export REACT_APP_NUCLIO_API_URL=http://localhost:30000/nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com
                        export REACT_APP_IGUAZIO_API_URL=http://localhost:30000/platform-api.default-tenant.app.vmdev36.lab.iguazeng.com
                    '''
                }

                common.conditional_stage('Start Services', true) {
                    // Start mock-server and application in the background
                    sh 'npm run mock-server &'
                    sh 'npm start &'
                }

                // Uncomment this stage if needed
                // common.conditional_stage('Run Regression Tests', true) {
                //     // Run cucumber-js tests
                //     sh './node_modules/.bin/cucumber-js --require-module @babel/register --require-module @babel/polyfill -f json:tests/reports/cucumber_report.json -f html:tests/reports/cucumber_report_default.html tests -t \'@smoke\''
                // }

                common.conditional_stage('Post-Test Cleanup', true) {
                    sh 'kill %1 || true'
                    sh 'kill %2 || true'
                }

                common.conditional_stage('Upload Artifacts', true) {
                    sh '''
                        # Environment variables
                        ART_URL="http://artifactory.iguazeng.com:8082/artifactory/ui-ci-reports"
                        AUTH="${ARTIFACTORY_USER}:${ARTIFACTORY_PASSWORD}"
                        LOCAL_FILE="tests/reports/cucumber_report_default.html"

                        # Generate the Artifactory path with the build number
                        ARTIFACTORY_PATH="cucumber_report_default_${env.BUILD_NUMBER}.html"

                        # Construct the full URL
                        URL="${ART_URL}/${ARTIFACTORY_PATH}"

                        # Upload the file to Artifactory
                        curl -X PUT -u ${AUTH} "${URL}" --data-binary @"${LOCAL_FILE}"
                    '''
                }

                // Uncomment this stage if needed
                // common.conditional_stage('Send Report Link to Slack', true) {
                //     script {
                //         def report_url = "http://artifactory.iguazeng.com:8082/artifactory/ui-ci-reports/cucumber_report_default_${env.BUILD_NUMBER}.html"
                //         // Send the link to Slack
                //         sh """
                //             curl -X POST -H 'Content-type: application/json' --data '{"channel": "${SLACK_CHANNEL}", "text": "Here is the latest regression test report: ${report_url}"}' \
                //             -H "Authorization: Bearer ${SLACK_TOKEN}" https://slack.com/api/chat.postMessage
                //         """
                //     }
                // }
            }
        }
    }
}

post {
    always {
        script {
            // Ensure any remaining background processes are terminated
            sh 'pkill -f npm || true'
        }
    }
}