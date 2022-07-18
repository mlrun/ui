import React from 'react'

import RegisterArtifactModal from '../../RegisterArtifactModal/RegisterArtifactModal'

// import { SECONDARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as CreatFunctionIcon } from 'igz-controls/images/function2-icon.svg'
import { ReactComponent as DataSetIcon } from 'igz-controls/images/overview-icon.svg'
import { ReactComponent as FeatureSetIcon } from 'igz-controls/images/set-icon.svg'
import { ReactComponent as RegisterArtifactIcon } from 'igz-controls/images/flow-icon.svg'
import { ReactComponent as CreateJobIcon } from 'igz-controls/images/run2-icon.svg'
// import { ReactComponent as DeployModelIcon } from 'igz-controls/images/rocket-icon.svg'
import { ReactComponent as FeatureVectorIcon } from 'igz-controls/images/vector-icon.svg'
import { ReactComponent as RegisterModelIcon } from 'igz-controls/images/model-icon.svg'
import { ReactComponent as RTFunctionIcon } from 'igz-controls/images/realtime-icon-b.svg'
import { ReactComponent as ServingFunctionIcon } from 'igz-controls/images/serving-icon.svg'
// import { ReactComponent as UploadIcon } from 'igz-controls/images/upload-icon.svg'

export const handleClick = (navigate, openPopUp) => handler => {
  const target = handler()
  return target.type && target.type === 'modal'
    ? openPopUp(target.component, target.props)
    : target.externalLink
    ? (window.top.location.href = target.path)
    : navigate(target.path)
}

export const getInitialCards = (projectName, navigate) => {
  const base_url = `/projects/${projectName}`

  return {
    collection: {
      title: 'Data',
      subTitle:
        'This section enable users to upload data , crate features and register external data. Keep in mind that this explaination is only temporary and should be replaced soon enough. This is not the final version.',
      actions: [
        //TODO: un-comment after wizard ready
        // {
        //   icon: <UploadIcon />,
        //   id: 'uploadData',
        //   label: 'Upload data',
        //   path: {
        //     target: 'uploaddata'
        //   },
        //   tooltip: 'Test'
        // },
        {
          icon: <FeatureSetIcon />,
          id: 'createFeatureSet',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-sets?openPanel=true`
          }),
          label: 'Create Features Set',
          tooltip: ''
        },
        {
          icon: <DataSetIcon />,
          id: 'registerDataset',
          handleClick: () => ({
            component: RegisterArtifactModal,
            props: {
              //TODO: un-comment for 1.3
              // actions: formState => [
              //   {
              //     disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //     label: 'Register and view',
              //     onClick: () => {
              //       formState.handleSubmit()
              //       if (!formState.invalid) {
              //         navigate(`${base_url}/datasets`)
              //       }
              //     }
              //   },
              //   {
              //     disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //     label: 'Register',
              //     onClick: formState.handleSubmit,
              //     variant: SECONDARY_BUTTON
              //   }
              // ],
              artifactKind: 'dataset',
              projectName,
              refresh: () => {},
              title: 'Register dataset'
            },
            type: 'modal'
          }),
          label: 'Register Dataset',
          tooltip: ''
        },
        {
          icon: <RegisterArtifactIcon />,
          id: 'registerArtifact',
          handleClick: () => ({
            component: RegisterArtifactModal,
            props: {
              //TODO: un-comment for 1.3
              // actions: formState => [
              //   {
              //     disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //     label: 'Register and view',
              //     onClick: () => {
              //       formState.handleSubmit()

              //       if (!formState.invalid) {
              //         navigate(`${base_url}/files`)
              //       }
              //     }
              //   },
              //   {
              //     disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //     label: 'Register',
              //     onClick: formState.handleSubmit,
              //     variant: SECONDARY_BUTTON
              //   }
              // ],
              artifactKind: 'artifact',
              projectName,
              refresh: () => {},
              title: 'Register artifact'
            },
            type: 'modal'
          }),
          label: 'Register Artifact',
          tooltip: ''
        },
        {
          icon: <FeatureVectorIcon />,
          id: 'createFeatureVector',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-vectors?openPanel=true`
          }),
          label: 'Create a Feature Vector',
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'featureset',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-sets`
          }),
          label: 'Feature Sets'
        },
        {
          id: 'artifacts',
          handleClick: () => ({
            path: `${base_url}/files`
          }),
          label: 'Artifacts'
        },
        {
          id: 'dataset',
          handleClick: () => ({
            path: `${base_url}/datasets`
          }),
          label: 'Datasets'
        },
        {
          id: 'featurevectors',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-vectors`
          }),
          label: 'Feature Vectors'
        }
      ]
    },
    development: {
      title: 'Jobs and Workflows',
      subTitle:
        'This section enables users to develop and run functions as jobs or workflows. Those jobs can run various processing types including model training, data processing and more. This is not the final version.',
      actions: [
        {
          id: 'createnewfunction',
          icon: <CreatFunctionIcon />,
          handleClick: () => ({
            path: `${base_url}/functions?openPanel=true`
          }),
          label: 'Create New Function',
          tooltip: ''
        },
        {
          id: 'createnewjob',
          icon: <CreateJobIcon />,
          handleClick: () => ({
            path: `${base_url}/jobs/monitor-jobs/create-new-job`
          }),
          label: 'Create New Job',
          tooltip: ''
        },
        {
          id: 'registeramodel',
          icon: <RegisterModelIcon />,
          handleClick: () => ({
            path: `${base_url}/models/models?openPanel=true`
          }),
          label: 'Register Model',
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'functions',
          handleClick: () => ({
            path: `${base_url}/functions`
          }),
          label: 'ML Functions'
        },
        {
          id: 'jobs',
          handleClick: () => ({
            path: `${base_url}/jobs`
          }),
          label: 'Jobs'
        },
        {
          id: 'models',
          handleClick: () => ({
            path: `${base_url}/models/models`
          }),
          label: 'Models'
        },
        {
          id: 'workflow',
          handleClick: () => ({
            path: `${base_url}/jobs/monitor-workflows`
          }),
          label: 'Workflow'
        }
      ]
    },
    deployment: {
      title: 'Deployment',
      subTitle:
        'This section enables users to deploy models, deploy real time graph and run real time pipelines at scale. This is not the final version.',
      actions: [
        {
          id: 'createRealTimeFunction',
          icon: <RTFunctionIcon />,
          label: 'Create RT function',
          handleClick: () => ({
            path: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
            externalLink: true
          }),
          tooltip: ''
        },
        {
          id: 'deployServingFunction',
          icon: <ServingFunctionIcon />,
          handleClick: () => ({
            path: `${base_url}/functions?openPanel=true`
          }),
          label: 'Deploy serving function',
          tooltip: ''
        }
        // {
        //   id: 'deployModel',
        //   icon: <DeployModelIcon />,
        //   handleClick: () => ({
        //     path: `${base_url}/models/models`
        //   }),
        //   label: 'Deploy Model',
        //   tooltip: ''
        // }
      ],
      additionalLinks: [
        {
          id: 'modelEndpoints',
          handleClick: () => ({
            path: `${base_url}/models/model-endpoints`
          }),
          label: 'Model Endpoints'
        },
        {
          id: 'realTimePipelines',
          handleClick: () => ({
            path: `${base_url}/models/real-time-pipelines`
          }),
          label: 'Real Time Pipelines'
        },
        {
          id: 'nuclioFunctions',
          handleClick: () => ({
            path: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
            externalLink: true
          }),
          label: 'Nuclio Functions'
        },
        {
          id: 'monitor',
          handleClick: () => ({
            path: `${base_url}/monitor`
          }),
          label: 'Monitoring'
        }
      ]
    }
  }
}
