@Library('pipelinex@development') _
import com.iguazio.pipelinex.DockerRepo

workDir = '/home/jenkins'
podLabel = 'mlrun-ui-release'
gitProject = 'ui'
gitProjectUser = 'mlrun'
dockerTag = env.TAG_NAME.replaceFirst(/^v/, '')

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
    common.notify_slack {
        container('base-build') {

            stage("git clone") {
                checkout scm
            }

            common.reportStage('Build mlrun/ui') {
                println(common.shellc("MLRUN_DOCKER_TAG=${dockerTag} npm run docker"))
                dockerx.images_push_multi_registries(
                            ["${gitProjectUser}/mlrun-ui:${dockerTag}"],
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
