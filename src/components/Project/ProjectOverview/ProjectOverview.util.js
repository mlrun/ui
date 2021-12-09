import React from 'react'

import { ReactComponent as SetIcon } from '../../../images/set-icon.svg'
import { ReactComponent as UploadIcon } from '../../../images/upload-icon.svg'

export const InitialCards = {
  collection: {
    title: 'Data collection',
    subTitle:
      'This section enable users to upload data , crate features and register external data. Keep in mind that this explaination is only temporary and should be replaced soon enough. This is not the final version.',
    actions: [
      {
        icon: <UploadIcon />,
        label: 'Upload data',
        link: '',
        tooltip: ''
      },
      {
        icon: <SetIcon />,
        label: 'Create features set',
        link: '',
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
