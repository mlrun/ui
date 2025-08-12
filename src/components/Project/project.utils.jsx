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

import { ARTIFACT_TYPE, DATASET_TYPE } from '../../constants'
import { PRIMARY_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import Api from 'igz-controls/images/mlrun-api-gateways.svg?react'
import Artifacts from 'igz-controls/images/navbar/mlrun-artifacts.svg?react'
import BatchRun from 'igz-controls/images/navbar/mlrun-jobs-and-workflows.svg?react'
import Datasets from 'igz-controls/images/navbar/mlrun-datasets.svg?react'
import Jupyter from 'igz-controls/images/jupyter.svg?react'
import Models from 'igz-controls/images/navbar/mlrun-models.svg?react'
import Realtime from 'igz-controls/images/navbar/mlrun-realtime-functions.svg?react'
import VSCode from 'igz-controls/images/vs-code.svg?react'

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
  generateNuclioLink,
  openPopUp,
  openRegisterModelModal,
  setCreateFeatureSetsPanelIsOpen,
  setIsNewFunctionPopUpOpen,
  isDemoMode
) => [
  {
    label: 'Register dataset',
    id: 'registerDataset',
    icon: <Datasets />,
    handler: () => {
      openRegisterArtifactModal(DATASET_TYPE)
    }
  },
  {
    label: 'Register artifact',
    id: 'registerFile',
    icon: <Artifacts />,
    handler: () => {
      openRegisterArtifactModal(ARTIFACT_TYPE)
    }
  },
  {
    label: 'Batch run',
    id: 'batchRun',
    icon: <BatchRun />,
    handler: () => {
      openPopUp(JobWizard, {
        params
      })
    }
  },
  {
    label: 'Train model',
    id: 'trainModel',
    icon: <Models />,
    handler: () => {
      openPopUp(JobWizard, {
        params,
        isTrain: true,
        wizardTitle: 'Train model',
        isOverview: true
      })
    }
  },
  {
    label: 'Batch inference',
    id: 'batchInference',
    icon: <Api />,
    handler: () => {
      openPopUp(JobWizard, {
        params,
        isBatchInference: true,
        wizardTitle: 'Batch inference'
      })
    }
  },
  {
    label: 'Create real-time function',
    id: 'createRealTimeFunction',
    icon: <Realtime />,
    handler: () =>
      window.open(generateNuclioLink(`/projects/${params.projectName}/create-function`), '_blank')
  },
  {
    label: 'Register model',
    id: 'registerModel',
    handler: () => {
      openRegisterModelModal()
    },
    hidden: !isDemoMode
  },
  {
    label: 'ML function',
    id: 'mlFunction',
    handler: () => {
      setIsNewFunctionPopUpOpen(true)
    },
    hidden: !isDemoMode
  },
  {
    label: 'Feature set',
    id: 'featureSet',
    handler: () => setCreateFeatureSetsPanelIsOpen(true),
    hidden: !isDemoMode
  },
  {
    label: 'Create feature vector',
    id: 'createFeatureVector',
    handler: () =>
      navigate(
        `/projects/${params.projectName}/feature-store/feature-vectors?openPanel=true`,
        '_blank'
      ),
    hidden: !isDemoMode
  }
]

export const generateTipMessageForCounter = (counter = '', page = '') => {
  return `Each ${counter} can have multiple versions, produced by multiple runs and given multiple tags.
          You can browse them in the ${page} page.`
}

export const handleFetchProjectError = (error, navigate, setConfirmData, dispatch) => {
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
    showErrorNotification(dispatch, error, 'Failed to fetch project data')
    navigate('/projects/')
  }
}
