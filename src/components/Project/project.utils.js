/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'

import JobWizard from '../JobWizard/JobWizard'

import { ARTIFACT_TYPE, DATASET_TYPE, MONITOR_JOBS_TAB } from '../../constants'
import { PRIMARY_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { openPopUp } from 'igz-controls/utils/common.util'

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
  openRegisterArtifactModal,
  openRegisterModelModal,
  setCreateFeatureSetsPanelIsOpen,
  setIsNewFunctionPopUpOpen,
  isDemoMode
) => [
  {
    label: 'Job',
    id: 'job',
    handler: () => {
      if (isDemoMode) {
        openPopUp(JobWizard, {
          params
        })
      } else {
        // todo: delete this when the job wizard is out of the demo mode
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}/create-new-job`)
      }
    }
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
      openRegisterArtifactModal(ARTIFACT_TYPE)
    }
  },
  {
    label: 'Register Model',
    id: 'registerModel',
    handler: () => {
      openRegisterModelModal()
    }
  },
  {
    label: 'Register Dataset',
    id: 'registerDataset',
    handler: () => {
      openRegisterArtifactModal(DATASET_TYPE)
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
