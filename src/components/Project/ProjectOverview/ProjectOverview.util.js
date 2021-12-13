import React from 'react'

import { ReactComponent as DataSetIcon } from '../../../images/overview-icon.svg'
import { ReactComponent as FeatureSetIcon } from '../../../images/set-icon.svg'
import { ReactComponent as RegisterFileIcon } from '../../../images/flow-icon.svg'
// import { ReactComponent as UploadIcon } from '../../../images/upload-icon.svg'

export const InitialCards = {
  collection: {
    title: 'Data collection',
    subTitle:
      'This section enable users to upload data , crate features and register external data. Keep in mind that this explaination is only temporary and should be replaced soon enough. This is not the final version.',
    actions: [
      // {
      //   handler: 'uploaddata',
      //   icon: <UploadIcon />,
      //   id: 'uploaddata',
      //   label: 'Upload data',
      //   tooltip: ''
      // },
      {
        handler: '/feature-store/feature-sets',
        icon: <FeatureSetIcon />,
        id: 'createfeatureset',
        label: 'Create features set',
        tooltip: ''
      },
      {
        handler: '/feature-store/datasets',
        icon: <DataSetIcon />,
        id: 'registerdataset',
        label: 'Register dataset',
        tooltip: ''
      },
      {
        handler: '/files',
        icon: <RegisterFileIcon />,
        id: 'registerfile',
        label: 'Register file',
        tooltip: ''
      },
      {
        handler: '/feature-store/feature-vectors',
        icon: <DataSetIcon />,
        id: 'createfeaturevector',
        label: 'Create a feature vector',
        tooltip: ''
      }
    ]
  },
  development: {
    title: 'Development',
    subTitle:
      'This section enables users to develop and run functions as jobs or workflows. Those jobs can run various processing types including model training, data processing and more. This is not the final version.',
    actions: []
  },
  deployment: {
    title: 'Deployment',
    subTitle:
      'This section enables users to deploy models, deploy real time graph and run real time pipelines at scale. This is not the final version.',
    actions: []
  }
}
