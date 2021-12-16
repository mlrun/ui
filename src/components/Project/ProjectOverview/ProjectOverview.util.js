import React from 'react'

import { ReactComponent as CreatFunctionIcon } from '../../../images/function2-icon.svg'
import { ReactComponent as DataSetIcon } from '../../../images/overview-icon.svg'
import { ReactComponent as FeatureSetIcon } from '../../../images/set-icon.svg'
import { ReactComponent as RegisterFileIcon } from '../../../images/flow-icon.svg'
import { ReactComponent as CreateJobIcon } from '../../../images/run2-icon.svg'
import { ReactComponent as UploadIcon } from '../../../images/upload-icon.svg'

export const getInitialCards = projectName => {
  const base_url = `/projects/${projectName}`

  return {
    collection: {
      title: 'Data collection',
      subTitle:
        'This section enable users to upload data , crate features and register external data. Keep in mind that this explaination is only temporary and should be replaced soon enough. This is not the final version.',
      actions: [
        {
          id: 'uploadData',
          icon: <UploadIcon />,
          label: 'Upload data',
          path: 'uploaddata',
          tooltip: 'Test'
        },
        {
          id: 'createFeatureSet',
          icon: <FeatureSetIcon />,
          label: 'Create features set',
          path: `${base_url}/feature-store/feature-sets?openPanel=true`,
          tooltip: ''
        },
        {
          id: 'registerDataset',
          icon: <DataSetIcon />,
          label: 'Register dataset',
          path: `${base_url}/feature-store/datasets?openPanel=true`,
          tooltip: ''
        },
        {
          id: 'registerFile',
          icon: <RegisterFileIcon />,
          label: 'Register file',
          path: `${base_url}/files?openPanel=true`,
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
          label: 'feature set',
          path: `${base_url}/feature-store/feature-sets`
        },
        {
          id: 'files',
          label: 'files',
          path: `${base_url}/files`
        },
        {
          id: 'dataset',
          label: 'dataset',
          path: `${base_url}/feature-store/datasets`
        },
        {
          id: 'featurevectors',
          label: 'feature vectors',
          path: `${base_url}/feature-store/feature-vectors`
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
          path: `${base_url}/functions?openPanel=true`,
          tooltip: ''
        },
        {
          id: 'createNewJob',
          icon: <CreateJobIcon />,
          label: 'Create new job',
          path: `${base_url}/jobs/monitor-jobs/create-new-job`,
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'functions',
          label: 'functions',
          path: `${base_url}/functions`
        },
        {
          id: 'jobs',
          label: 'jobs',
          path: `${base_url}/jobs`
        },
        {
          id: 'workflow',
          label: 'workflow',
          path: `${base_url}/jobs/monitor-workflows`
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
          path: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
          tooltip: '',
          externalLink: true
        },
        {
          id: 'deployServingFunction',
          icon: <CreateJobIcon />,
          path: `${base_url}/functions`,
          label: 'Deploy serving function',
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'modelEndpoints',
          label: 'model endpoints',
          path: `${base_url}/models/model-endpoints`
        },
        {
          id: 'realTimePipelines',
          label: 'real time pipelines',
          path: `${base_url}/models/real-time-pipelines`
        },
        {
          id: 'nuclioFunctions',
          label: 'nuclio functions',
          path: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
          externalLink: true
        }
      ]
    }
  }
}
