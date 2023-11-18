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
import { isNil } from 'lodash'

import DatasetsView from './DatasetsView'
import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import {
  DATASET_TYPE,
  DATASETS_FILTERS,
  DATASETS_PAGE,
  FILTER_MENU_MODAL,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import {
  fetchDataSet,
  fetchDataSets,
  removeDataSet,
  removeDataSets,
  showArtifactsPreview
} from '../../reducers/artifactsReducer'
import {
  checkForSelectedDataset,
  fetchDataSetRowData,
  filters,
  generatePageData,
  handleApplyDetailsChanges,
  registerDatasetTitle
} from './datasets.util'
import { largeResponseCatchHandler } from '../../utils/largeResponseCatchHandler'
import { cancelRequest } from '../../utils/cancelRequest'
import { createDatasetsRowData, getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setArtifactTags } from '../../utils/artifacts.util'
import { setFilters } from '../../reducers/filtersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useYaml } from '../../hooks/yaml.hook'
import { getViewMode } from '../../utils/helper'
import { copyToClipboard } from '../../utils/copyToClipboard'
import { generateUri } from '../../utils/resources'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import { useSortTable } from '../../hooks/useSortTable.hook'

import { ReactComponent as TagIcon } from 'igz-controls/images/tag-icon.svg'
import { ReactComponent as YamlIcon } from 'igz-controls/images/yaml.svg'
import { ReactComponent as ArtifactView } from 'igz-controls/images/eye-icon.svg'
import { ReactComponent as Copy } from 'igz-controls/images/copy-to-clipboard-icon.svg'
import { ReactComponent as DownloadIcon } from 'igz-controls/images/download.svg'

const Datasets = () => {
  const [datasets, setDatasets] = useState([])
  const [allDatasets, setAllDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [urlTagOption] = useGetTagOptions(null, filters, null, DATASETS_FILTERS)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const datasetsRef = useRef(null)
  const viewMode = getViewMode(window.location.search)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const datasetsFilters = useMemo(
    () => filtersStore[FILTER_MENU_MODAL][DATASETS_FILTERS].values,
    [filtersStore]
  )
  const pageData = useMemo(
    () => generatePageData(selectedDataset, viewMode, params),
    [selectedDataset, viewMode, params]
  )

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedDataset.tag ?? ''
    }),
    [selectedDataset.tag]
  )

  const fetchData = useCallback(
    filters => {
      dispatch(fetchDataSets({ project: params.projectName, filters, setLargeRequestErrorMessage }))
        .unwrap()
        .then(dataSetsResponse => {
          setArtifactTags(
            dataSetsResponse,
            setDatasets,
            setAllDatasets,
            filters,
            dispatch,
            DATASETS_PAGE
          )

          return dataSetsResponse
        })
        .catch(largeResponseCatchHandler)
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
    () => dataset => {
      const isTargetPathValid = getIsTargetPathValid(dataset ?? {}, frontendSpec)
      const downloadPath = `${dataset?.target_path}${dataset?.model_file || ''}`

      return [
        [
          {
            label: 'Download',
            icon: <DownloadIcon />,
            onClick: dataset => {
              dispatch(
                setDownloadItem({
                  path: downloadPath,
                  user: dataset.producer?.owner,
                  id: downloadPath
                })
              )
              dispatch(setShowDownloadsList(true))
            }
          },
          {
            label: 'Copy URI',
            icon: <Copy />,
            onClick: dataset => copyToClipboard(generateUri(dataset, DATASETS_PAGE), dispatch)
          },
          {
            label: 'View YAML',
            icon: <YamlIcon />,
            onClick: toggleConvertedYaml
          },
          {
            label: 'Add a tag',
            icon: <TagIcon />,
            onClick: handleAddTag
          }
        ],
        [
          {
            disabled: !isTargetPathValid,
            id: 'dataset-preview',
            label: 'Preview',
            icon: <ArtifactView />,
            onClick: dataset => {
              dispatch(
                showArtifactsPreview({
                  isPreview: true,
                  selectedItem: dataset
                })
              )
            }
          }
        ]
      ]
    },
    [dispatch, frontendSpec, handleAddTag, toggleConvertedYaml]
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
          `/projects/${params.projectName}/${DATASETS_PAGE}/${params.name}/${changes.data.tag.currentFieldValue}/overview`,
          { replace: true }
        )
      }
    }

    handleRefresh(datasetsFilters)
  }

  const handleRequestOnExpand = useCallback(
    async dataset => {
      await fetchDataSetRowData(
        dispatch,
        dataset,
        setSelectedRowData,
        datasetsFilters.iter,
        datasetsFilters.tag,
        params.projectName,
        frontendSpec
      )
    },
    [datasetsFilters.iter, datasetsFilters.tag, dispatch, frontendSpec, params.projectName]
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
          return createDatasetsRowData(contentItem, params.projectName, frontendSpec, true)
        })
      : datasets.map(contentItem =>
          createDatasetsRowData(contentItem, params.projectName, frontendSpec)
        )
  }, [datasets, filtersStore.groupBy, frontendSpec, latestItems, params.projectName])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

  const { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders } =
    useSortTable({
      headers: tableHeaders,
      content: tableContent,
      sortConfig: { excludeSortBy: 'labels', defaultSortBy: 'updated', defaultDirection: 'desc' }
    })

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [location, navigate, pageData.details.menu, params.name, params.tab, params.tag])

  useEffect(() => {
    if (isNil(filtersStore.tagOptions) && urlTagOption) {
      fetchData({ ...datasetsFilters, tag: urlTagOption })
    }
  }, [datasetsFilters, fetchData, filtersStore, urlTagOption])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

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

  const handleRegisterDataset = useCallback(() => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: DATASET_TYPE,
      projectName: params.projectName,
      refresh: handleRefresh,
      title: registerDatasetTitle
    })
  }, [handleRefresh, params.projectName])

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
      handleRegisterDataset={handleRegisterDataset}
      largeRequestErrorMessage={largeRequestErrorMessage}
      pageData={pageData}
      ref={datasetsRef}
      selectedDataset={selectedDataset}
      selectedRowData={selectedRowData}
      setDatasets={setDatasets}
      setSelectedDataset={setSelectedDataset}
      setSelectedRowData={setSelectedRowData}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      toggleConvertedYaml={toggleConvertedYaml}
      urlTagOption={urlTagOption}
      viewMode={viewMode}
    />
  )
}

export default Datasets
