import React from 'react'

import { ReactComponent as CreatFunctionIcon } from '../../../images/function2-icon.svg'
import { ReactComponent as DataSetIcon } from '../../../images/overview-icon.svg'
import { ReactComponent as FeatureSetIcon } from '../../../images/set-icon.svg'
import { ReactComponent as RegisterFileIcon } from '../../../images/flow-icon.svg'
import { ReactComponent as CreateJobIcon } from '../../../images/run2-icon.svg'
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
        //   id: 'uploadData',
        //   icon: <UploadIcon />,
        //   label: 'Upload data',
        //   path: {
        //   target: 'uploaddata'
        // },
        //   tooltip: 'Test'
        // },
        {
          id: 'createFeatureSet',
          icon: <FeatureSetIcon />,
          label: 'Create features set',
          path: {
            target: `${base_url}/feature-store/feature-sets?openPanel=true`
          },
          tooltip: ''
        },
        {
          id: 'registerDataset',
          icon: <DataSetIcon />,
          label: 'Register dataset',
          path: {
            target: `${base_url}/feature-store/datasets?openPanel=true`
          },
          tooltip: 'some text'
        },
        {
          id: 'registerFile',
          icon: <RegisterFileIcon />,
          label: 'Register file',
          path: {
            target: `${base_url}/files?openPanel=true`
          },
          tooltip: ''
        }
        // {
        //   path: `${base_url}/feature-store/feature-vectors`,
        //   icon: <DataSetIcon />,
        //   id: 'createFeatureVector',
        //   label: 'Create a feature vector',
        //   tooltip: ''
        // }
      ],
      additionalLinks: [
        {
          id: 'featureset',
          label: 'Feature Set',
          path: { target: `${base_url}/feature-store/feature-sets` }
        },
        {
          id: 'files',
          label: 'Files',
          path: { target: `${base_url}/files` }
        },
        {
          id: 'dataset',
          label: 'Dataset',
          path: { target: `${base_url}/feature-store/datasets` }
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
          id: 'createNewFunction',
          icon: <CreatFunctionIcon />,
          label: 'Create new function',
          path: { target: `${base_url}/functions?openPanel=true` },
          tooltip: ''
        },
        {
          id: 'createNewJob',
          icon: <CreateJobIcon />,
          label: 'Create new job',
          path: { target: `${base_url}/jobs/monitor-jobs/create-new-job` },
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'functions',
          label: 'Functions',
          path: { target: `${base_url}/functions` }
        },
        {
          id: 'jobs',
          label: 'Jobs',
          path: { target: `${base_url}/jobs` }
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
          icon: <CreateJobIcon />,
          label: 'Create RT function',
          path: {
            target: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
            externalLink: true
          },
          tooltip: ''
        },
        {
          id: 'deployServingFunction',
          icon: <CreateJobIcon />,
          path: { target: `${base_url}/functions` },
          label: 'Deploy serving function',
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
        }
      ]
    }
  }
}

export const calcIsDemoPrefix = (path, isDemoMode) => {
  let prefix = path.includes('?') ? '&' : '?'
  return isDemoMode ? prefix.concat('demo=true') : ''
}

export const handlePath = (history, cb, isDemoMode) => ({
  target,
  externalLink
}) => {
  return target.indexOf('/') < 0
    ? cb(target.toLowerCase())
    : externalLink
    ? (window.top.location.href = target)
    : history.push(`${target}${calcIsDemoPrefix(target, isDemoMode)}`)
}
