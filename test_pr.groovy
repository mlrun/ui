@Library('pipelinex@DEVOPS-342_test_PR') _
import com.iguazio.pipelinex.DockerRepo
//testing the PR pipeline
workDir = '/home/jenkins'
podLabel = 'mlrun-ui-release'
gitProject = 'ui'
gitProjectUser = 'mlrun'
prnumber_split = "${env.JOB_NAME.substring(env.JOB_NAME.lastIndexOf('/') + 1, env.JOB_NAME.length()).toLowerCase()}"
prnumber = "${prnumber_split.substring(prnumber_split.lastIndexOf('-') + 1, prnumber_split.length()).toLowerCase()}"

podTemplate(
    label: podLabel,
    containers: [
        containerTemplate(name: 'jnlp', image: 'jenkins/jnlp-slave:4.0.1-1', workingDir: workDir, resourceRequestCpu: '2000m', resourceLimitCpu: '2000m', resourceRequestMemory: '2048Mi', resourceLimitMemory: '2048Mi'),
        containerTemplate(name: 'base-build', image: 'iguazioci/alpine-base-build:5540620c8c98efee4debfaa14e4c2a47d7110f22', workingDir: workDir, ttyEnabled: true, command: 'cat'),
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
    ],
) {
    node(podLabel) {
        common.notify_slack {
            container('base-build') {

                stage("git clone") {
                    checkout scm
                }

                common.reportStage('Test mlrun/ui PR') {
                    println(common.shellc(". ./ci_start_ui_tests.sh"))
                }
                
                common.reportStage('update pr status') {
                    withCredentials([
                        string(credentialsId: "iguazio-prod-git-user-token", variable: 'GIT_TOKEN')
                    ]) {
                        container('jnlp') {
                            github.update_pr_status(gitProject, gitProjectUser, prnumber, GIT_TOKEN)
                        }
                    }
                }
            }
        }
    }
}
