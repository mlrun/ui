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
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import AddArtifactTagPopUp from '../../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import DeployModelPopUp from '../../../elements/DeployModelPopUp/DeployModelPopUp'
import ModelsView from './ModelsView'

import detailsActions from '../../../actions/details'
import filtersActions from '../../../actions/filters'
import { fetchArtifactTags, removeModel, removeModels } from '../../../reducers/artifactsReducer'
import { setNotification } from '../../../reducers/notificationReducer'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  MODEL_TYPE,
  MODELS_PAGE,
  MODELS_TAB,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../../../constants'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { getArtifactIdentifier } from '../../../utils/getUniqueIdentifier'
import { useGetTagOptions } from '../../../hooks/useGetTagOptions.hook'
import {
  checkForSelectedModel,
  fetchModelsRowData,
  filters,
  generatePageData,
  getFeatureVectorData,
  handleApplyDetailsChanges
} from './models.util'
import { useModelsPage } from '../ModelsPage.context'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { createModelsRowData } from '../../../utils/createArtifactsContent'
import { cancelRequest } from '../../../utils/cancelRequest'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Models = ({ fetchModelFeatureVector, setFilters, getFilterTagOptions }) => {
  const [selectedModel, setSelectedModel] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [urlTagOption] = useGetTagOptions(fetchArtifactTags, filters, MODEL_TYPE)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const detailsStore = useSelector(store => store.detailsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const modelsRef = useRef(null)
  const pageData = useMemo(() => generatePageData(selectedModel), [selectedModel])
  const { fetchData, models, setModels, toggleConvertedYaml } = useModelsPage()

  const handleDeployModel = useCallback(model => {
    openPopUp(DeployModelPopUp, { model })
  }, [])

  const handleRefresh = useCallback(
    filters => {
      getFilterTagOptions(fetchArtifactTags, params.projectName, MODEL_TYPE)
      setSelectedRowData({})
      setModels([])

      return fetchData(filters)
    },
    [fetchData, getFilterTagOptions, params.projectName, setModels]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: handleRefresh,
        projectName: params.projectName
      })
    },
    [handleRefresh, params.projectName]
  )

  const actionsMenu = useMemo(
    () => [
      {
        label: 'Deploy',
        onClick: handleDeployModel
      },
      {
        label: 'Add a tag',
        onClick: handleAddTag
      },
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ],
    [handleAddTag, handleDeployModel, toggleConvertedYaml]
  )

  const handleRemoveRowData = useCallback(
    model => {
      const newStoreSelectedRowData = {
        ...artifactsStore.models.selectedRowData
      }
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[model.data.ui.value]
      delete newPageDataSelectedRowData[model.data.ui.value]

      dispatch(removeModel(newStoreSelectedRowData))
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [artifactsStore.models.selectedRowData, dispatch, selectedRowData]
  )

  const handleRequestOnExpand = useCallback(
    async model => {
      await fetchModelsRowData(
        dispatch,
        model,
        setSelectedRowData,
        filtersStore.iter,
        filtersStore.tag,
        params.projectName
      )
    },
    [dispatch, filtersStore.iter, filtersStore.tag, params.projectName]
  )

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        params.projectName,
        selectedModel,
        setNotification,
        dispatch
      )
    },
    [params.projectName, selectedModel, setNotification, dispatch]
  )

  const applyDetailsChangesCallback = changes => {
    if ('tag' in changes.data) {
      setSelectedRowData({})
      setModels([])

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/models/models/${params.name}/${changes.data.tag.currentFieldValue}/overview`,
          { replace: true }
        )
      }
    }

    handleRefresh(filtersStore)
  }

  useEffect(() => {
    dispatch(removeModel({}))
    setSelectedRowData({})
  }, [filtersStore.iter, filtersStore.tag, dispatch])

  const { latestItems, handleExpandRow } = useGroupContent(
    models,
    getArtifactIdentifier,
    handleRemoveRowData,
    handleRequestOnExpand,
    MODELS_PAGE,
    MODELS_TAB
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createModelsRowData(contentItem, params.projectName, true)
        })
      : models.map(contentItem => createModelsRowData(contentItem, params.projectName))
  }, [filtersStore.groupBy, latestItems, models, params.projectName])

  useEffect(() => {
    return () => {
      setModels([])
      dispatch(removeModels())
      setSelectedModel({})
      cancelRequest(modelsRef, 'cancel')
    }
  }, [dispatch, setModels])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS || isEmpty(filtersStore.iter)) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [filtersStore.groupBy, filtersStore.iter, filtersStore.tag, params.name, setFilters])

  useEffect(() => {
    if (urlTagOption) {
      fetchData({
        tag: urlTagOption,
        iter: SHOW_ITERATIONS
      })
    }
  }, [fetchData, urlTagOption])

  useEffect(() => {
    checkForSelectedModel(
      params.name,
      selectedRowData,
      models,
      params.tag,
      params.iter,
      params.uid,
      navigate,
      params.projectName,
      setSelectedModel
    )
  }, [
    models,
    navigate,
    params.iter,
    params.name,
    params.projectName,
    params.tag,
    params.uid,
    selectedRowData
  ])

  useEffect(() => setModels([]), [filtersStore.tag, setModels])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  useEffect(() => {
    if (
      selectedModel.feature_vector &&
      !detailsStore.error &&
      isEmpty(detailsStore.modelFeatureVectorData)
    ) {
      const { name, tag } = getFeatureVectorData(selectedModel.feature_vector)
      fetchModelFeatureVector(params.projectName, name, tag)
    }
  }, [
    detailsStore.error,
    detailsStore.modelFeatureVectorData,
    fetchModelFeatureVector,
    params.projectName,
    selectedModel.feature_vector
  ])

  return (
    <ModelsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      models={models}
      pageData={pageData}
      ref={modelsRef}
      selectedModel={selectedModel}
      selectedRowData={selectedRowData}
      setSelectedModel={setSelectedModel}
      tableContent={tableContent}
    />
  )
}

export default connect(null, {
  ...detailsActions,
  ...filtersActions
})(Models)
