label = "${UUID.randomUUID().toString()}"
git_project = "ui"
git_project_user = "mlrun"
git_project_upstream_user = "mlrun"
git_deploy_user = "iguazio-prod-git-user"
git_deploy_user_token = "iguazio-prod-git-user-token"
git_deploy_user_private_key = "iguazio-prod-git-user-private-key"


podTemplate(label: "${git_project}-${label}", inheritFrom: "jnlp-docker-nodejs") {
    node("${git_project}-${label}") {
        pipelinex = library(identifier: 'pipelinex@development', retriever: modernSCM(
                [$class       : 'GitSCMSource',
                 credentialsId: git_deploy_user_private_key,
                 remote       : "git@github.com:iguazio/pipelinex.git"])).com.iguazio.pipelinex
        common.notify_slack {
            withCredentials([
                    string(credentialsId: git_deploy_user_token, variable: 'GIT_TOKEN')
            ]) {
                github.release(git_deploy_user, git_project, git_project_user, git_project_upstream_user, true, GIT_TOKEN, 50000) {
                    container('docker-cmd') {

                        common.reportStage('Build mlrun/ui') {
                            dir("${github.BUILD_FOLDER}/src/github.com/${git_project_upstream_user}/${git_project}") {
                                
                                println(common.shellc("MLRUN_DOCKER_TAG=${github.DOCKER_TAG_VERSION} npm run docker"))
                                dockerx.images_push_multi_registries(
                                            ["${git_project_upstream_user}/mlrun-ui:${github.DOCKER_TAG_VERSION}"],
                                            [
                                                pipelinex.DockerRepo.ARTIFACTORY_IGUAZIO,
                                                pipelinex.DockerRepo.MLRUN_DOCKER_HUB,
                                                pipelinex.DockerRepo.MLRUN_QUAY_IO
                                            ]
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
