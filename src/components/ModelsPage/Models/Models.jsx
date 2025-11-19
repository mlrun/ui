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
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import RegisterModelModal from '../../../elements/RegisterModelModal/RegisterModelModal'
import JobWizard from '../../JobWizard/JobWizard'
import Artifacts from '../../Artifacts/Artifacts'

import { fetchModels, removeModels } from '../../../reducers/artifactsReducer'
import { MODELS_PAGE, MODELS_TAB, MODEL_TYPE } from '../../../constants'
import {
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  handleDeployModelFailure
} from './models.util'
import { createModelsRowData } from '../../../utils/createArtifactsContent'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseChipsData } from '../../../utils/convertChipsData'
import { useMode } from '../../../hooks/mode.hook'
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

const Models = ({ isAllVersions }) => {
  const { isDemoMode } = useMode()
  const artifactsStore = useSelector(store => store.artifactsStore)

  const generateDetailsFormInitialValues = useCallback(
    (selectedModel, internal_labels) => ({
      tag: selectedModel.tag ?? '',
      labels: parseChipsData(selectedModel.labels ?? {}, internal_labels)
    }),
    []
  )

  const handleRegisterModel = useCallback((params, refreshModels, modelsFilters) => {
    openPopUp(RegisterModelModal, {
      params,
      refresh: () => refreshModels(modelsFilters)
    })
  }, [])

  const handleTrainModel = params => {
    openPopUp(JobWizard, {
      params,
      tab: MODELS_TAB,
      isTrain: true,
      wizardTitle: 'Train model'
    })
  }

  return (
    <Artifacts
      actionButtons={[
        {
          variant: PRIMARY_BUTTON,
          label: 'Train model',
          className: 'action-button',
          onClick: handleTrainModel
        },
        {
          variant: TERTIARY_BUTTON,
          label: 'Register model',
          className: 'action-button',
          onClick: handleRegisterModel,
          hidden: !isDemoMode
        }
      ]}
      artifactType={MODEL_TYPE}
      createArtifactsRowData={createModelsRowData}
      fetchArtifacts={fetchModels}
      generateActionsMenu={generateActionsMenu}
      generateDetailsFormInitialValues={generateDetailsFormInitialValues}
      generatePageData={generatePageData}
      handleApplyDetailsChanges={handleApplyDetailsChanges}
      handleDeployArtifactFailure={handleDeployModelFailure}
      isAllVersions={isAllVersions}
      page={MODELS_PAGE}
      removeArtifacts={removeModels}
      storeArtifactTypeLoading={artifactsStore.models.modelLoading}
      tab={MODELS_TAB}
    />
  )
}

Models.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default Models
