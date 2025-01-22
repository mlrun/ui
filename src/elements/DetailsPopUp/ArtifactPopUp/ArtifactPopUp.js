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

import { DATASETS_TAB, FILES_TAB, MODEL_TYPE, MODELS_TAB } from '../../../constants'
import { toggleYaml } from '../../../reducers/appReducer'
import artifactsApi from '../../../api/artifacts-api'
import { parseArtifacts } from '../../../utils/parseArtifacts'
import { generateArtifacts } from '../../../utils/generateArtifacts'
import { filterArtifacts } from '../../../utils/filterArtifacts'

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
          fetchArtifact: artifactsApi.getDataSets
        }
      : artifactData.kind === MODEL_TYPE
        ? {
            type: MODELS_TAB,
            generateActionsMenu: generateModelActionsMenu,
            pageData: generateModelPageData(selectedArtifact, viewMode),
            fetchArtifact: artifactsApi.getModels
          }
        : {
            type: FILES_TAB,
            generateActionsMenu: generateFileActionsMenu,
            pageData: generateFilePageData(viewMode),
            fetchArtifact: artifactsApi.getFiles
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

    artifactContext
      .fetchArtifact(artifactData.project, artifactMin)
      .then(({ data }) => {
        const result = parseArtifacts(data.artifacts)
        const artifacts = generateArtifacts(filterArtifacts(result), DATASETS_TAB, data.artifacts)

        if (artifacts?.length > 0) {
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
  }, [artifactData, artifactContext, dispatch, onResolve])

  const actionsMenu = useMemo(
    () => fileMin =>
      artifactContext.generateActionsMenu(
        fileMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        () => {},
        artifactData.project,
        fetchArtifact,
        {},
        selectedArtifact,
        () => {},
        false,
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
