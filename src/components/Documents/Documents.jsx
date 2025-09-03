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
import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import Artifacts from '../Artifacts/Artifacts'

import { DOCUMENT_TYPE, DOCUMENTS_PAGE } from '../../constants'
import { generatePageData, handleApplyDetailsChanges, generateActionsMenu } from './documents.util'
import { createDocumentsRowData } from '../../utils/createArtifactsContent'
import { fetchDocuments, removeDocuments } from '../../reducers/artifactsReducer'
import { parseChipsData } from '../../utils/convertChipsData'

const Documents = ({ isAllVersions = false }) => {
  const artifactsStore = useSelector(store => store.artifactsStore)

  const generateDetailsFormInitialValues = useCallback(
    (selectedDocument, internal_labels) => ({
      tag: selectedDocument?.tag ?? '',
      labels: parseChipsData(selectedDocument?.labels ?? {}, internal_labels)
    }),
    []
  )

  return (
    <Artifacts
      artifactType={DOCUMENT_TYPE}
      createArtifactsRowData={createDocumentsRowData}
      fetchArtifacts={fetchDocuments}
      generateActionsMenu={generateActionsMenu}
      generateDetailsFormInitialValues={generateDetailsFormInitialValues}
      generatePageData={generatePageData}
      handleApplyDetailsChanges={handleApplyDetailsChanges}
      isAllVersions={isAllVersions}
      page={DOCUMENTS_PAGE}
      removeArtifacts={removeDocuments}
      storeArtifactTypeLoading={artifactsStore.documents.documentLoading}
    />
  )
}

Documents.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default Documents
