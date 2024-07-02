@Library('pipelinex@development') _
import com.iguazio.pipelinex.DockerRepo

pipeline {
    agent { label 'ubuntu_ui_runner' } // Specify the runner here

    environment {
        REACT_APP_FUNCTION_CATALOG_URL = 'https://raw.githubusercontent.com/mlrun/functions/master'
        REACT_APP_MLRUN_API_URL = 'http://localhost:30000/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
        REACT_APP_NUCLIO_API_URL = 'http://localhost:30000/nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
        REACT_APP_IGUAZIO_API_URL = 'http://localhost:30000/platform-api.default-tenant.app.vmdev36.lab.iguazeng.com'
        ARTIFACTORY_URL = 'http://artifactory.example.com/path/to/artifacts/cucumber_report.html'
        ARTIFACTORY_USER = credentials('artifactory-username') // Assume you have these credentials stored in Jenkins
        ARTIFACTORY_PASSWORD = credentials('artifactory-password')
        SLACK_TOKEN = credentials('slack-bot-token')
        SLACK_CHANNEL = '#your-slack-channel'
        ARTIFACTORY_BASE_URL = 'http://artifactory.example.com/path/to/artifacts/' // Base URL for Artifactory
    }

    triggers {
        cron('H 0 * * *') // Run the job nightly at midnight
    }

    stages {
        stage('Pull Latest Changes') {
            steps {
                script {
                    dir('/root/ui') {
                        sh 'git pull'
                    }
                }
            }
        }

        stage('Set up Environment') {
            steps {
                script {
                    dir('/root/ui') {
                        // You can uncomment the following line if npm install is needed
                        // sh 'npm install'

                        // Ensure environment variables are set for the session
                        sh '''
                            export REACT_APP_FUNCTION_CATALOG_URL=${REACT_APP_FUNCTION_CATALOG_URL}
                            export REACT_APP_MLRUN_API_URL=${REACT_APP_MLRUN_API_URL}
                            export REACT_APP_NUCLIO_API_URL=${REACT_APP_NUCLIO_API_URL}
                            export REACT_APP_IGUAZIO_API_URL=${REACT_APP_IGUAZIO_API_URL}
                        '''
                    }
                }
            }
        }

        stage('Start Services') {
            steps {
                script {
                    dir('/root/ui') {
                        // Start mock-server and application in the background
                        sh 'npm run mock-server &'
                        sh 'npm start &'
                    }
                }
            }
        }

        stage('Run Regression Tests') {
            steps {
                script {
                    dir('/root/ui') {
                        // Run regression tests
                        sh 'npm run test:regression'
                    }
                }
            }
        }

        stage('Post-Test Cleanup') {
            steps {
                script {
                    // Ensure background processes are killed after tests
                    sh 'kill %1 || true'
                    sh 'kill %2 || true'
                }
            }
        }

        stage('Upload Artifacts') {
            steps {
                script {
                    dir('/root/ui') {
                        // Upload the test report to Artifactory
                        sh '''
                            curl -u ${ARTIFACTORY_USER}:${ARTIFACTORY_PASSWORD} -T tests/reports/cucumber_report.html ${ARTIFACTORY_URL}
                        '''
                    }
                }
            }
        }

        stage('Send Report Link to Slack') {
            steps {
                script {
                    // Construct the URL to the uploaded report
                    def report_url = "${ARTIFACTORY_BASE_URL}cucumber_report.html"

                    // Send the link to Slack
                    sh """
                        curl -X POST -H 'Content-type: application/json' --data '{"channel": "${SLACK_CHANNEL}", "text": "Here is the latest regression test report: ${report_url}"}' \
                        -H "Authorization: Bearer ${SLACK_TOKEN}" https://slack.com/api/chat.postMessage
                    """
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
}