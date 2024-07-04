@Library('pipelinex@development')
import com.iguazio.pipelinex.JobException

def node_label = 'ubuntu-ui-runner'

common.set_current_display_name("UI_CI_Test")

pipeline {
    environment {
        TMPDIR = '/home/iguazio/tmp'
        CHROME_BIN = sh(script: 'which google-chrome', returnStdout: true).trim()
    }
    agent {
        label node_label
    }
    stages {
        stage('Pull Latest Changes') {
            steps {
                script {
                common.conditional_stage('Pull Latest Changes', true) {
                    checkout scm
                }
                }
            }
        }
        stage('Set up Environment') {
            steps {
                script {
                common.conditional_stage('Set up Environment', true) {
                    sh 'npm install'
                }
                }
            }
        }
        stage('Prepare Chrome Environment') {
            steps {
                sh '''
                    mkdir -p $TMPDIR && chmod 1777 $TMPDIR
                '''
            }
        }
        stage('Start Services') {
            steps {
                script {
                common.conditional_stage('Start Services', true) {
                    sh '''
                        npm run mock-server &
                        npm start &
                    '''
                }
                }
            }
        }
        stage('Run Smoke Tests') {
            steps {
                script {
                    common.conditional_stage('Run Smoke Tests', true) {
                        sh '''
                            npm run add-comment-to-http-client
                            npm run test:ci-cd-smoke-1 -- --chrome-options='--headless --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9222 --disable-gpu --window-size=1920,1080 --disable-software-rasterizer --verbose --log-path=$TMPDIR/chrome.log'
                        '''
                    }
                }
            }
        }
        stage('Run Regression Tests') {
            steps {
                script {
                common.conditional_stage('Run Regression Tests', true) {
                        sh '''
                            npm run test:regression -- --chrome-options='--headless --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9222 --disable-gpu --window-size=1920,1080 --disable-software-rasterizer --verbose --log-path=$TMPDIR/chrome.log'
                        '''
                    }
                }
            }
        }
        stage('Post-Test Cleanup') {
            steps {
                script {
                common.conditional_stage('Post-Test Cleanup', true) {
                    sh '''
                        pkill -f npm || true
                    '''
                }
                }
            }
        }
        stage('Upload Artifacts') {
            steps {
                script {
                common.conditional_stage('Upload Artifacts', true) {
                        def files = ["cucumber_report_default.html", "cucumber_report.html"]
                        for (file in files) {
                            def local_file = "tests/reports/${file}"
                            def artifact_path = "${file}_${BUILD_NUMBER}.html"
                            def url = "http://artifactory.iguazeng.com:8082/artifactory/ui-ci-reports/${artifact_path}"
                            sh """
                                curl -X PUT -u ${ARTIFACTORY_CRED} "${url}" --data-binary @"${local_file}"
                            """
                        }
                    }
                }
                }
        }
        stage('Cleaning up') {
            steps {
                script {
                common.conditional_stage('Cleaning up', true) {
                    sh '''
                        pkill -f npm || true
                    '''
                }
                }
            }
        }
        stage('Build Status') {
            steps {
                script {
                common.conditional_stage('Build Status', true) {
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
