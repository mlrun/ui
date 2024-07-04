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
                }

                common.conditional_stage('Set up Environment', true) {
                    sh 'npm install'
                }

                common.conditional_stage('Prepare Chrome Environment', true) {
                    sh '''
                        export TMPDIR=/home/iguazio/tmp
                        mkdir -p $TMPDIR && chmod 1777 $TMPDIR
                        export CHROME_BIN=$(which google-chrome)
                    '''
                }

                common.conditional_stage('Start Services', true) {
                    sh '''
                        npm run mock-server &
                        npm start &
                    '''
                }

                common.conditional_stage('Run Smoke Tests', true) {
                    // Run smoke tests
                    sh '''
                        npm run add-comment-to-http-client
                        npm run test:ci-cd-smoke-1 -- --chrome-options='--headless --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9222 --disable-gpu --window-size=1920,1080 --disable-software-rasterizer --verbose --log-path=$TMPDIR/chrome.log'
                    '''
                }

                common.conditional_stage('Run Regression Tests', true) {
                    // Run regression tests
                    sh '''
                        npm run test:regression -- --chrome-options='--headless --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9222 --disable-gpu --window-size=1920,1080 --disable-software-rasterizer --verbose --log-path=$TMPDIR/chrome.log'
                    '''
                }

                common.conditional_stage('Post-Test Cleanup', true) {
                    sh '''
                        kill %1 || true
                        kill %2 || true
                        # Ensure any remaining background processes are terminated
                        pkill -f npm || true
                    '''
                }

                common.conditional_stage('Upload Artifacts', true) {
                    sh '''
                        ART_URL="http://artifactory.iguazeng.com:8082/artifactory/ui-ci-reports"
                        AUTH="${ARTIFACTORY_CRED}"
                        LOCAL_FILE="tests/reports/cucumber_report_default.html"

                        # Generate the Artifactory path with the build number
                        ARTIFACTORY_PATH="cucumber_report_default_${BUILD_NUMBER}.html"

                        # Construct the full URL
                        URL="${ART_URL}/${ARTIFACTORY_PATH}"

                        # Upload the file to Artifactory
                        curl -X PUT -u ${AUTH} "${URL}" --data-binary @"${LOCAL_FILE}"
                    '''
                }

                common.conditional_stage('Cleaning up', true) {
                    sh '''
                        pkill -f npm || true
                    '''
                }

                common.conditional_stage('Build Status', true) {
                    script {
                        if (currentBuild.currentResult == 'SUCCESS') {
                            echo 'Build was successful!'
                        } else {
                            echo 'Build failed!'
                        }
                    }
                }
            }
        }
    }
}