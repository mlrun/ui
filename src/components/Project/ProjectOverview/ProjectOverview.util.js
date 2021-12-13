import React from 'react'

import { ReactComponent as CreatFunctionIcon } from '../../../images/function2-icon.svg'
import { ReactComponent as DataSetIcon } from '../../../images/overview-icon.svg'
import { ReactComponent as FeatureSetIcon } from '../../../images/set-icon.svg'
import { ReactComponent as RegisterFileIcon } from '../../../images/flow-icon.svg'
import { ReactComponent as CreateJobIcon } from '../../../images/run2-icon.svg'
// import { ReactComponent as UploadIcon } from '../../../images/upload-icon.svg'

export const getInitialCards = projectName => ({
  collection: {
    title: 'Data collection',
    subTitle:
      'This section enable users to upload data , crate features and register external data. Keep in mind that this explaination is only temporary and should be replaced soon enough. This is not the final version.',
    actions: [
      // {
      //   handler: 'uploaddata',
      //   icon: <UploadIcon />,
      //   id: 'uploadData',
      //   label: 'Upload data',
      //   tooltip: ''
      // },
      {
        handler: `/projects/${projectName}/feature-store/feature-sets`,
        icon: <FeatureSetIcon />,
        id: 'createFeatureSet',
        label: 'Create features set',
        tooltip: ''
      },
      {
        handler: `/projects/${projectName}/feature-store/datasets`,
        icon: <DataSetIcon />,
        id: 'registerDataset',
        label: 'Register dataset',
        tooltip: ''
      },
      {
        handler: `/projects/${projectName}/files`,
        icon: <RegisterFileIcon />,
        id: 'registerFile',
        label: 'Register file',
        tooltip: ''
      }
      // {
      //   handler: `/projects/${projectName}/feature-store/feature-vectors`,
      //   icon: <DataSetIcon />,
      //   id: 'createFeatureVector',
      //   label: 'Create a feature vector',
      //   tooltip: ''
      // }
    ],
    additionalLinks: [{}]
  },
  development: {
    title: 'Development',
    subTitle:
      'This section enables users to develop and run functions as jobs or workflows. Those jobs can run various processing types including model training, data processing and more. This is not the final version.',
    actions: [
      {
        handler: `/projects/${projectName}/functions`,
        icon: <CreatFunctionIcon />,
        id: 'createNewFunction',
        label: 'Create new function',
        tooltip: ''
      },
      {
        handler: `/projects/${projectName}/jobs/monitor-jobs/create-new-job`,
        icon: <CreateJobIcon />,
        id: 'createNewJob',
        label: 'Create new job',
        tooltip: ''
      }
    ]
  },
  deployment: {
    title: 'Deployment',
    subTitle:
      'This section enables users to deploy models, deploy real time graph and run real time pipelines at scale. This is not the final version.',
    actions: [
      {
        handler: `${window.mlrunConfig.nuclioUiUrl}/projects/${projectName}/functions`,
        icon: <CreateJobIcon />,
        id: 'createRealTimeFunction',
        label: 'Create real time function',
        tooltip: '',
        externalLink: true
      },
      {
        handler: `/projects/${projectName}/functions?demo=true`,
        icon: <CreateJobIcon />,
        id: 'deployServingFunction',
        label: 'Deploy serving function',
        tooltip: ''
      }
    ]
  }
})
