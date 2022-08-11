import React from 'react'

import { MONITOR_JOBS_TAB } from '../../constants'
import { PRIMARY_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'

import { ReactComponent as Jupyter } from 'igz-controls/images/jupyter.svg'
import { ReactComponent as VSCode } from 'igz-controls/images/vs-code.svg'

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
  openRegisterModel,
  openRegisterArtifactModal,
  openNewFunctionModal,
  setCreateFeatureSetPanelIsOpen
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
    handler: openNewFunctionModal
  },
  {
    label: 'Feature Set',
    id: 'featureSet',
    handler: () => setCreateFeatureSetPanelIsOpen(true)
  },
  {
    label: 'Register Artifact',
    id: 'registerFile',
    handler: () => {
      openRegisterArtifactModal('artifact')
    }
  },
  {
    label: 'Register Model',
    id: 'registerModel',
    handler: openRegisterModel
  },
  {
    label: 'Register Dataset',
    id: 'registerDataset',
    handler: () => {
      openRegisterArtifactModal('dataset')
    }
  }
]

export const handleFetchProjectError = (error, navigate, setConfirmData) => {
  if (error.response?.status === FORBIDDEN_ERROR_STATUS_CODE) {
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
