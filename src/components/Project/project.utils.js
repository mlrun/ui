import React from 'react'

import { MONITOR_JOBS_TAB, PRIMARY_BUTTON, STATUS_CODE_FORBIDDEN } from '../../constants'

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

export const generateCreateNewOptions = (
  navigate,
  params,
  setArtifactKind,
  setIsPopupDialogOpen,
  setCreateFeatureSetsPanelIsOpen,
  setIsNewFunctionPopUpOpen
) => [
  {
    label: 'Job',
    id: 'job',
    handler: () =>
      navigate(`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}/create-new-job`)
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
    label: 'Register Artifact',
    id: 'registerFile',
    handler: () => {
      setIsPopupDialogOpen(true)
      setArtifactKind('artifact')
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

export const handleFetchProjectError = (error, navigate, setConfirmData) => {
  if (error.response?.status === STATUS_CODE_FORBIDDEN) {
    setConfirmData({
      message: 'You are not permitted to view this project.',
      messageOnly: true,
      btnConfirmLabel: 'Okay',
      btnConfirmType: PRIMARY_BUTTON,
      confirmHandler: () => {
        navigate('/projects/')
      }
    })
  } else {
    navigate('/projects/')
  }
}
