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

import { DATASET_TYPE, DATASETS_PAGE } from '../../constants'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import {
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerDatasetTitle
} from './datasets.util'
import { createDatasetsRowData } from '../../utils/createArtifactsContent'
import { fetchDataSets, removeDataSets } from '../../reducers/artifactsReducer'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseChipsData } from '../../utils/convertChipsData'

const Datasets = ({ isAllVersions = false }) => {
  const artifactsStore = useSelector(store => store.artifactsStore)
  const generateDetailsFormInitialValues = useCallback(
    (selectedDataset, internal_labels) => ({
      tag: selectedDataset.tag ?? '',
      labels: parseChipsData(selectedDataset.labels ?? {}, internal_labels)
    }),
    []
  )

  const handleRegisterDataset = useCallback((params, refreshDatasets, datasetsFilters) => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: DATASET_TYPE,
      params,
      refresh: () => refreshDatasets(datasetsFilters),
      title: registerDatasetTitle
    })
  }, [])

  return (
    <Artifacts
      actionButtons={[
        {
          variant: PRIMARY_BUTTON,
          label: registerDatasetTitle,
          className: 'action-button',
          onClick: handleRegisterDataset
        }
      ]}
      artifactType={DATASET_TYPE}
      createArtifactsRowData={createDatasetsRowData}
      fetchArtifacts={fetchDataSets}
      generateActionsMenu={generateActionsMenu}
      generateDetailsFormInitialValues={generateDetailsFormInitialValues}
      generatePageData={generatePageData}
      handleApplyDetailsChanges={handleApplyDetailsChanges}
      isAllVersions={isAllVersions}
      page={DATASETS_PAGE}
      removeArtifacts={removeDataSets}
      storeArtifactTypeLoading={artifactsStore.datasets.datasetLoading}
    />
  )
}

Datasets.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default Datasets
