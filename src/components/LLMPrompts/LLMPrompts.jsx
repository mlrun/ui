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

import Artifacts from '../Artifacts/Artifacts'

import { LLM_PROMPT_TYPE, LLM_PROMPTS_TAB } from '../../constants'
import { createLLMPromptsRowData } from '../../utils/createArtifactsContent'
import { fetchLLMPrompts, removeDataSets } from '../../reducers/artifactsReducer'
import { generateActionsMenu, generatePageData, handleApplyDetailsChanges } from './llmPrompts.util'

const LLMPrompts = ({ isAllVersions }) => {
  const artifactsStore = useSelector(store => store.artifactsStore)

  const generateDetailsFormInitialValues = useCallback(
    selectedLLMPrompt => ({
      tag: selectedLLMPrompt.tag ?? ''
    }),
    []
  )

  return (
    <Artifacts
      artifactType={LLM_PROMPT_TYPE}
      createArtifactsRowData={createLLMPromptsRowData}
      fetchArtifacts={fetchLLMPrompts}
      generateActionsMenu={generateActionsMenu}
      generateDetailsFormInitialValues={generateDetailsFormInitialValues}
      generatePageData={generatePageData}
      handleApplyDetailsChanges={handleApplyDetailsChanges}
      isAllVersions={isAllVersions}
      removeArtifacts={removeDataSets}
      storeArtifactTypeLoading={artifactsStore.LLMPrompts.LLMPromptLoading}
      tab={LLM_PROMPTS_TAB}
    />
  )
}

LLMPrompts.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default LLMPrompts
