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
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty, isNil } from 'lodash'

import DatasetsView from './DatasetsView'
import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'

import { DATASETS_PAGE, GROUP_BY_NAME, GROUP_BY_NONE, TAG_FILTER_ALL_ITEMS } from '../../constants'
import {
  fetchDataSet,
  fetchDataSets,
  removeDataSet,
  removeDataSets
} from '../../reducers/artifactsReducer'
import {
  checkForSelectedDataset,
  fetchDataSetRowData,
  filters,
  generatePageData,
  handleApplyDetailsChanges
} from './datasets.util'
import { cancelRequest } from '../../utils/cancelRequest'
import { createDatasetsRowData } from '../../utils/createArtifactsContent'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setArtifactTags } from '../../utils/artifacts.util'
import { setFilters } from '../../reducers/filtersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useYaml } from '../../hooks/yaml.hook'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Datasets = () => {
  const [datasets, setDatasets] = useState([])
  const [allDatasets, setAllDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [urlTagOption] = useGetTagOptions(null, filters)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const datasetsRef = useRef(null)
  const pageData = useMemo(() => generatePageData(selectedDataset), [selectedDataset])
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedDataset.tag ?? ''
    }),
    [selectedDataset.tag]
  )

  const fetchData = useCallback(
    filters => {
      dispatch(fetchDataSets({ project: params.projectName, filters }))
        .unwrap()
        .then(dataSetsResponse => {
          setArtifactTags(dataSetsResponse, setDatasets, setAllDatasets, filters, dispatch)

          return dataSetsResponse
        })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      setSelectedRowData({})
      setDatasets([])
      setAllDatasets([])

      return fetchData(filters)
    },
    [fetchData]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: handleRefresh,
        getArtifact: () =>
          fetchDataSet({
            project: params.projectName,
            dataSet: artifact.db_key,
            iter: true,
            tag: TAG_FILTER_ALL_ITEMS
          }),
        projectName: params.projectName
      })
    },
    [handleRefresh, params.projectName]
  )

  const actionsMenu = useMemo(
    () => [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      },
      {
        label: 'Add a tag',
        onClick: handleAddTag
      }
    ],
    [handleAddTag, toggleConvertedYaml]
  )

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        params.projectName,
        selectedDataset,
        setNotification,
        dispatch
      )
    },
    [dispatch, params.projectName, selectedDataset]
  )

  const applyDetailsChangesCallback = changes => {
    if ('tag' in changes.data) {
      setSelectedRowData({})
      setDatasets([])
      setAllDatasets([])

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/datasets/${params.name}/${changes.data.tag.currentFieldValue}/overview`,
          { replace: true }
        )
      }
    }

    handleRefresh(filtersStore)
  }

  const handleRequestOnExpand = useCallback(
    async dataset => {
      await fetchDataSetRowData(
        dispatch,
        dataset,
        setSelectedRowData,
        filtersStore.iter,
        filtersStore.tag,
        params.projectName
      )
    },
    [dispatch, filtersStore.iter, filtersStore.tag, params.projectName]
  )

  const handleRemoveRowData = useCallback(
    dataset => {
      const newStoreSelectedRowData = {
        ...artifactsStore.dataSets.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[dataset.data.ui.identifier]
      delete newPageDataSelectedRowData[dataset.data.ui.identifier]

      dispatch(removeDataSet(newStoreSelectedRowData))
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [artifactsStore.dataSets.selectedRowData.content, dispatch, selectedRowData]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    datasets,
    getArtifactIdentifier,
    handleRemoveRowData,
    handleRequestOnExpand,
    null,
    DATASETS_PAGE
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createDatasetsRowData(contentItem, params.projectName, true)
        })
      : datasets.map(contentItem => createDatasetsRowData(contentItem, params.projectName))
  }, [datasets, filtersStore.groupBy, latestItems, params.projectName])

  useEffect(() => {
    dispatch(removeDataSet({}))
    setSelectedRowData({})
  }, [filtersStore.iter, filtersStore.tag, dispatch])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [location, navigate, pageData.details.menu, params.name, params.tab, params.tag])

  useEffect(() => {
    if (isNil(filtersStore.tagOptions) && urlTagOption) {
      fetchData({ ...filtersStore, tag: urlTagOption })
    }
  }, [fetchData, filtersStore, urlTagOption])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS || isEmpty(filtersStore.iter)) {
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
    }
  }, [filtersStore.groupBy, filtersStore.iter, filtersStore.tag, params.name, dispatch])

  useEffect(() => {
    checkForSelectedDataset(
      params.name,
      selectedRowData,
      allDatasets,
      params.tag,
      params.iter,
      params.uid,
      params.projectName,
      setSelectedDataset,
      navigate
    )
  }, [
    allDatasets,
    navigate,
    params.iter,
    params.name,
    params.projectName,
    params.tag,
    params.uid,
    selectedRowData
  ])

  useEffect(() => {
    return () => {
      setDatasets([])
      setAllDatasets([])
      dispatch(removeDataSets())
      setSelectedDataset({})
      cancelRequest(datasetsRef, 'cancel')
    }
  }, [dispatch])

  return (
    <DatasetsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      convertedYaml={convertedYaml}
      datasets={datasets}
      detailsFormInitialValues={detailsFormInitialValues}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={datasetsRef}
      selectedDataset={selectedDataset}
      selectedRowData={selectedRowData}
      setSelectedDataset={setSelectedDataset}
      tableContent={tableContent}
      toggleConvertedYaml={toggleConvertedYaml}
    />
  )
}

export default Datasets
