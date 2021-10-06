import React from 'react'

import { MONITOR_JOBS_TAB, SCHEDULE_TAB } from '../../constants'

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
    link: `/projects/${match.params.projectName}/jobs/${MONITOR_JOBS_TAB}`
  },
  {
    label: 'Schedule jobs',
    link: `/projects/${match.params.projectName}/jobs/${SCHEDULE_TAB}`
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
  setIsPopupDialogOpen,
  setCreateFeatureSetsPanelIsOpen,
  setIsNewFunctionPopUpOpen
) => [
  {
    label: 'Job',
    id: 'job',
    handler: () =>
      history.push(
        `/projects/${match.params.projectName}/jobs/${MONITOR_JOBS_TAB}/create-new-job`
      )
  },
  {
    label: 'ML Function',
    id: 'mlFunction',
    handler: () => {
      setIsNewFunctionPopUpOpen(true)
    }
  },
  {
    label: 'Feature Set',
    id: 'featureSet',
    handler: () => setCreateFeatureSetsPanelIsOpen(true)
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
