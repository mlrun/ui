import React from 'react'

import { ReactComponent as CreatFunctionIcon } from '../../../images/function2-icon.svg'
import { ReactComponent as DataSetIcon } from '../../../images/overview-icon.svg'
import { ReactComponent as FeatureSetIcon } from '../../../images/set-icon.svg'
import { ReactComponent as RegisterArtifactIcon } from '../../../images/flow-icon.svg'
import { ReactComponent as CreateJobIcon } from '../../../images/run2-icon.svg'
import { ReactComponent as DeployModelIcon } from '../../../images/rocket-icon.svg'
import { ReactComponent as FeatureVectorIcon } from '../../../images/vector-icon.svg'
import { ReactComponent as RegisterModelIcon } from '../../../images/model-icon.svg'
import { ReactComponent as RTFunctionIcon } from '../../../images/realtime-icon-b.svg'
import { ReactComponent as ServingFunctionIcon } from '../../../images/serving-icon.svg'
// import { ReactComponent as UploadIcon } from '../../../images/upload-icon.svg'

export const getInitialCards = projectName => {
  const base_url = `/projects/${projectName}`

  return {
    collection: {
      title: 'Data collection',
      subTitle:
        'This section enable users to upload data , crate features and register external data. Keep in mind that this explaination is only temporary and should be replaced soon enough. This is not the final version.',
      actions: [
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
          label: 'Create Features Set',
          path: {
            target: `${base_url}/feature-store/feature-sets?openPanel=true`
          },
          tooltip: ''
        },
        {
          icon: <DataSetIcon />,
          id: 'registerDataset',
          label: 'Register Dataset',
          path: {
            target: `${base_url}/datasets?openPanel=true`
            // target: 'dataset' // Phase 2
          },
          tooltip: ''
        },
        {
          icon: <RegisterArtifactIcon />,
          id: 'registerArtifact',
          label: 'Register Artifact',
          path: {
            target: `${base_url}/files?openPanel=true`
            // target: 'artifact' // Phase 2
          },
          tooltip: ''
        },
        {
          icon: <FeatureVectorIcon />,
          id: 'createFeatureVector',
          label: 'Create a Feature Vector',
          path: {
            target: `${base_url}/feature-store/feature-vectors?openPanel=true`
            // target: 'featureVector' //  Phase 2
          },
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'featureset',
          label: 'Feature Sets',
          path: { target: `${base_url}/feature-store/feature-sets` }
        },
        {
          id: 'artifacts',
          label: 'Artifacts',
          path: { target: `${base_url}/files` }
        },
        {
          id: 'dataset',
          label: 'Datasets',
          path: { target: `${base_url}/datasets` }
        },
        {
          id: 'featurevectors',
          label: 'Feature Vectors',
          path: { target: `${base_url}/feature-store/feature-vectors` }
        }
      ]
    },
    development: {
      title: 'Development',
      subTitle:
        'This section enables users to develop and run functions as jobs or workflows. Those jobs can run various processing types including model training, data processing and more. This is not the final version.',
      actions: [
        {
          id: 'createnewfunction',
          icon: <CreatFunctionIcon />,
          label: 'Create New Function',
          path: { target: `${base_url}/functions?openPanel=true` },
          tooltip: ''
        },
        {
          id: 'createnewjob',
          icon: <CreateJobIcon />,
          label: 'Create New Job',
          path: { target: `${base_url}/jobs/monitor-jobs/create-new-job` },
          tooltip: ''
        },
        {
          id: 'registeramodel',
          icon: <RegisterModelIcon />,
          label: 'Register Model',
          path: {
            target: `${base_url}/models/models?openPanel=true`
            // target: 'model'
          },
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'functions',
          label: 'ML Functions',
          path: { target: `${base_url}/functions` }
        },
        {
          id: 'jobs',
          label: 'Jobs',
          path: { target: `${base_url}/jobs` }
        },
        {
          id: 'models',
          label: 'Models',
          path: { target: `${base_url}/models/models` }
        },
        {
          id: 'workflow',
          label: 'Workflow',
          path: { target: `${base_url}/jobs/monitor-workflows` }
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
          path: {
            target: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
            externalLink: true
          },
          tooltip: ''
        },
        {
          id: 'deployServingFunction',
          icon: <ServingFunctionIcon />,
          label: 'Deploy serving function',
          path: { target: `${base_url}/functions?openPanel=true` },
          tooltip: ''
        },
        {
          id: 'deployModel',
          icon: <DeployModelIcon />,
          label: 'Deploy Model',
          path: { target: `${base_url}/models/models` },
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'modelEndpoints',
          label: 'Model Endpoints',
          path: { target: `${base_url}/models/model-endpoints` }
        },
        {
          id: 'realTimePipelines',
          label: 'Real Time Pipelines',
          path: { target: `${base_url}/models/real-time-pipelines` }
        },
        {
          id: 'nuclioFunctions',
          label: 'Nuclio Functions',
          path: {
            target: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
            externalLink: true
          }
        },
        {
          id: 'monitor',
          label: 'Monitoring',
          path: { target: `${base_url}/monitor` }
        }
      ]
    }
  }
}

export const handlePath = (navigate, cb) => ({ target, externalLink }) => {
  return target.indexOf('/') < 0
    ? cb(target.toLowerCase())
    : externalLink
    ? (window.top.location.href = target)
    : navigate(target)
}
