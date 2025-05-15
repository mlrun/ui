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

import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'
import Artifacts from '../Artifacts/Artifacts'

import { ARTIFACT_OTHER_TYPE, ARTIFACT_TYPE, FILES_PAGE } from '../../constants'
import {
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerArtifactTitle
} from './files.util'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import { fetchFiles, removeFiles } from '../../reducers/artifactsReducer'
import { openPopUp } from 'igz-controls/utils/common.util'
import { PRIMARY_BUTTON } from 'igz-controls/constants'

const Files = ({ isAllVersions = false }) => {
  const artifactsStore = useSelector(store => store.artifactsStore)

  const generateDetailsFormInitialValues = useCallback(
    selectedFile => ({
      tag: selectedFile.tag ?? ''
    }),
    []
  )

  const handleRegisterArtifact = useCallback((params, refreshFiles, filesFilters) => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: ARTIFACT_TYPE,
      params,
      refresh: () => refreshFiles(filesFilters),
      title: registerArtifactTitle
    })
  }, [])

  return (
    <Artifacts
      actionButtons={[
        {
          variant: PRIMARY_BUTTON,
          label: registerArtifactTitle,
          className: 'action-button',
          onClick: handleRegisterArtifact
        }
      ]}
      artifactType={ARTIFACT_OTHER_TYPE}
      createArtifactsRowData={createFilesRowData}
      fetchArtifacts={fetchFiles}
      generateActionsMenu={generateActionsMenu}
      generateDetailsFormInitialValues={generateDetailsFormInitialValues}
      generatePageData={generatePageData}
      handleApplyDetailsChanges={handleApplyDetailsChanges}
      isAllVersions={isAllVersions}
      page={FILES_PAGE}
      removeArtifacts={removeFiles}
      storeArtifactTypeLoading={artifactsStore.files.fileLoading}
    />
  )
}

Files.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default Files
