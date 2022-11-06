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
import { connect, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import DeployModelPopUp from '../../../elements/DeployModelPopUp/DeployModelPopUp'
import ModelsView from './ModelsView'

import artifactsAction from '../../../actions/artifacts'
import detailsActions from '../../../actions/details'
import filtersActions from '../../../actions/filters'
import notificationActions from '../../../actions/notification'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  GROUP_BY_NAME,
  GROUP_BY_NONE,
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
import { ModelsPageContext } from '../modelsPage.util'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { createModelsRowData } from '../../../utils/createArtifactsContent'
import { cancelRequest } from '../../../utils/cancelRequest'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Models = ({
  fetchArtifactTags,
  fetchModel,
  fetchModelFeatureVector,
  fetchModels,
  removeModel,
  removeModels,
  setFilters,
  setNotification,
  updateArtifact,
  getFilterTagOptions
}) => {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const urlTagOption = useGetTagOptions(fetchArtifactTags, filters)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const detailsStore = useSelector(store => store.detailsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const modelsRef = useRef(null)
  const pageData = useMemo(() => generatePageData(selectedModel), [selectedModel])
  const { toggleConvertedYaml } = React.useContext(ModelsPageContext)

  const handleDeployModel = useCallback(model => {
    openPopUp(DeployModelPopUp, { model })
  }, [])

  const actionsMenu = useMemo(
    () => [
      {
        label: 'Deploy',
        onClick: handleDeployModel
      },
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ],
    [handleDeployModel, toggleConvertedYaml]
  )

  const fetchData = useCallback(
    async filters => {
      fetchModels(params.projectName, filters).then(result => {
        if (result) {
          setModels(result)
        }

        return result
      })
    },
    [fetchModels, params.projectName]
  )

  const handleRemoveRowData = useCallback(
    model => {
      const newStoreSelectedRowData = {
        ...artifactsStore.models.selectedRowData
      }
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[model.data.ui.value]
      delete newPageDataSelectedRowData[model.data.ui.value]

      removeModel(newStoreSelectedRowData)
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [artifactsStore.models.selectedRowData, removeModel, selectedRowData]
  )

  const handleRequestOnExpand = useCallback(
    async model => {
      await fetchModelsRowData(
        fetchModel,
        model,
        setSelectedRowData,
        filtersStore.iter,
        filtersStore.tag,
        params.projectName,
        selectedModel
      )
    },
    [fetchModel, filtersStore.iter, filtersStore.tag, params.projectName, selectedModel]
  )

  const handleRefresh = useCallback(
    filters => {
      getFilterTagOptions(fetchArtifactTags, params.projectName)
      setSelectedRowData({})
      setModels([])

      return fetchData(filters)
    },
    [fetchArtifactTags, fetchData, getFilterTagOptions, params.projectName]
  )

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        handleRefresh,
        params.projectName,
        params.name,
        selectedModel,
        setNotification,
        filtersStore,
        updateArtifact
      )
    },
    [
      filtersStore,
      handleRefresh,
      params.name,
      params.projectName,
      selectedModel,
      setNotification,
      updateArtifact
    ]
  )

  useEffect(() => {
    removeModel({})
    setSelectedRowData({})
  }, [filtersStore.iter, filtersStore.tag, removeModel])

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
          return createModelsRowData(contentItem, params.projectName, !isEmpty(selectedModel), true)
        })
      : models.map(contentItem =>
          createModelsRowData(contentItem, params.projectName, !isEmpty(selectedModel))
        )
  }, [filtersStore.groupBy, latestItems, models, params.projectName, selectedModel])

  useEffect(() => {
    return () => {
      setModels([])
      removeModels()
      setSelectedModel({})
      cancelRequest(modelsRef, 'cancel')
    }
  }, [removeModels])

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
      navigate,
      params.projectName,
      setSelectedModel
    )
  }, [models, navigate, params.iter, params.name, params.projectName, params.tag, selectedRowData])

  useEffect(() => setModels([]), [filtersStore.tag])

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

const actionCreators = {
  setNotification: notificationActions.setNotification,
  updateArtifact: artifactsAction.updateArtifact
}

export default connect(null, {
  ...artifactsAction,
  ...detailsActions,
  ...filtersActions,
  ...actionCreators
})(Models)
