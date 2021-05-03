import React from 'react'

import { ReactComponent as Jupyter } from '../../images/jupyter.svg'
import { ReactComponent as VSCode } from '../../images/vs-code.svg'

export const launchIDEOptions = [
  {
    label: 'Jupyter',
    id: 'jupyter',
    icon: <Jupyter />
  },
  {
    label: 'VS Code',
    id: 'vsCode',
    icon: <VSCode />
  }
]

export const getLinks = match => [
  {
    label: 'Models',
    link: `/projects/${match.params.projectName}/models`
  },
  {
    label: `Feature store${
      window.mlrunConfig.betaMode === 'enabled' ? ' (Beta)' : ''
    }`,
    link: `/projects/${match.params.projectName}/feature-store`
  },
  {
    label: 'Files',
    link: `/projects/${match.params.projectName}/files`
  },
  {
    label: 'Jobs and workflows',
    link: `/projects/${match.params.projectName}/jobs/monitor`
  },
  {
    label: 'Schedule jobs',
    link: `/projects/${match.params.projectName}/jobs/schedule`
  },
  {
    label: 'ML functions',
    link: `/projects/${match.params.projectName}/functions`
  },
  {
    label: 'Real-time functions (Nuclio)',
    link: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`,
    externalLink: true
  },
  {
    label: 'API gateways (Nuclio)',
    link: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/api-gateways`,
    externalLink: true
  }
]

export const generateCreateNewOptions = (
  history,
  match,
  setArtifactKind,
  setIsPopupDialogOpen
) => [
  {
    label: 'Job',
    id: 'job',
    handler: () =>
      history.push(
        `/projects/${match.params.projectName}/jobs/monitor/create-new-job`
      )
  },
  {
    label: 'Register File',
    id: 'registerFile',
    handler: () => {
      setIsPopupDialogOpen(true)
      setArtifactKind('file')
    }
  },
  {
    label: 'Register Model',
    id: 'registerModel',
    handler: () => {
      setIsPopupDialogOpen(true)
      setArtifactKind('model')
    }
  },
  {
    label: 'Register Dataset',
    id: 'registerDataset',
    handler: () => {
      setIsPopupDialogOpen(true)
      setArtifactKind('dataset')
    }
  }
]
