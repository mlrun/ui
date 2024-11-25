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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, maxBy } from 'lodash'
import PropTypes from 'prop-types'

import DetailsPopUp from '../DetailsPopUp'

import { showArtifactErrorNotification } from '../../../utils/artifacts.util'
import { getViewMode } from '../../../utils/helper'
import {
  generateActionsMenu as generateFileActionsMenu,
  generatePageData as generateFilePageData
} from '../../../components/Files/files.util'
import {
  generateActionsMenu as generateDatasetActionsMenu,
  generatePageData as generateDatasetPageData
} from '../../../components/Datasets/datasets.util'
import {
  generateActionsMenu as generateModelActionsMenu,
  generatePageData as generateModelPageData
} from '../../../components/ModelsPage/Models/models.util'

import { fetchDataSets, fetchFiles, fetchModels } from '../../../reducers/artifactsReducer'
import { ARTIFACTS_TAB, DATASETS_TAB, FILES_TAB, MODELS_TAB } from '../../../constants'
import { toggleYaml } from '../../../reducers/appReducer'

const ArtifactPopUp = ({ artifactData, isOpen, onResolve }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedArtifact, setSelectedArtifact] = useState({})
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const viewMode = getViewMode(window.location.search)

  const artifactContext = useMemo(() => {
    return artifactData.kind === DATASETS_TAB
      ? {
          type: DATASETS_TAB,
          generateActionsMenu: generateDatasetActionsMenu,
          pageData: generateDatasetPageData(selectedArtifact, viewMode, {}, true),
          fetchArtifact: fetchDataSets
        }
      : artifactData.kind === ARTIFACTS_TAB
        ? {
            type: FILES_TAB,
            generateActionsMenu: generateFileActionsMenu,
            pageData: generateFilePageData(viewMode),
            fetchArtifact: fetchFiles
          }
        : {
            type: MODELS_TAB,
            generateActionsMenu: generateModelActionsMenu,
            pageData: generateModelPageData(selectedArtifact, viewMode),
            fetchArtifact: fetchModels
          }
  }, [selectedArtifact, artifactData.kind, viewMode])

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const fetchArtifact = useCallback(() => {
    const artifactMin = {
      name: artifactData.key,
      iter: artifactData.iteration,
      tree: artifactData.uid,
      tag: artifactData.tag
    }

    setIsLoading(true)

    dispatch(
      artifactContext.fetchArtifact({
        project: artifactData.project,
        filters: artifactMin
      })
    )
      .unwrap()
      .then(artifacts => {
        if (artifacts.length > 0) {
          const selectedArtifact =
            artifacts.length === 1
              ? artifacts[0]
              : artifacts.find(artifact => artifact.tag === 'latest' || maxBy(artifacts, 'updated'))

          setSelectedArtifact(selectedArtifact)

          setIsLoading(false)
        } else {
          showArtifactErrorNotification(dispatch, {}, artifactContext.type)

          onResolve()
        }
      })
      .catch(error => {
        showArtifactErrorNotification(dispatch, error, artifactContext.type)

        onResolve()
      })
  }, [
    artifactContext,
    dispatch,
    onResolve,
    artifactData.iteration,
    artifactData.key,
    artifactData.project,
    artifactData.tag,
    artifactData.uid
  ])

  const actionsMenu = useMemo(
    () => (fileMin, menuPosition) =>
      artifactContext.generateActionsMenu(
        fileMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        () => {},
        artifactData.project,
        fetchArtifact,
        {},
        menuPosition,
        selectedArtifact,
        true
      ),
    [
      artifactContext,
      dispatch,
      fetchArtifact,
      frontendSpec,
      selectedArtifact,
      artifactData.project,
      toggleConvertedYaml
    ]
  )

  useEffect(() => {
    if (isEmpty(selectedArtifact)) {
      fetchArtifact()
    }
  }, [fetchArtifact, selectedArtifact])

  return (
    <DetailsPopUp
      actionsMenu={actionsMenu}
      handleRefresh={fetchArtifact}
      isLoading={isLoading}
      isOpen={isOpen}
      onResolve={onResolve}
      pageData={artifactContext.pageData}
      selectedItem={selectedArtifact}
    />
  )
}

ArtifactPopUp.propTypes = {
  artifactData: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onResolve: PropTypes.func.isRequired
}

export default ArtifactPopUp
