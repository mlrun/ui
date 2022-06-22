import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import RegisterArtifactModal from '..//RegisterArtifactModal/RegisterArtifactModal'

import artifactsAction from '../../actions/artifacts'
import filtersActions from '../../actions/filters'
import {
  fetchDataSetRowData,
  generateDataSetsDetailsMenu,
  generatePageData,
  pageDataInitialState
} from './datasets.util'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  DATASETS,
  DATASETS_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'

import { useOpenPanel } from '../../hooks/openPanel.hook'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'

const Datasets = ({
  dataSets,
  fetchArtifactTags,
  fetchDataSet,
  fetchDataSets,
  filtersStore,
  getFilterTagOptions,
  loading,
  removeDataSet,
  removeDataSets,
  setFilters
}) => {
  const [pageData, setPageData] = useState(pageDataInitialState)
  const [datasets, setDatasets] = useState([])
  const [selectedItem, setSelectedItem] = useState({})
  const datasetsRef = useRef(null)
  const openPanelByDefault = useOpenPanel()
  const urlTagOption = useGetTagOptions(fetchArtifactTags, pageData.filters)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchData = useCallback(
    filters => {
      fetchDataSets(params.projectName, filters).then(result => {
        if (result) {
          setDatasets(generateArtifacts(filterArtifacts(result), DATASETS))
        }

        return result
      })
    },
    [fetchDataSets, params.projectName]
  )

  const cancelRequest = message => {
    datasetsRef.current?.cancel && datasetsRef.current.cancel(message)
  }

  const handleRequestOnExpand = useCallback(
    async item => {
      await fetchDataSetRowData(
        fetchDataSet,
        item,
        setPageData,
        !filtersStore.iter,
        filtersStore.tag
      )
    },
    [fetchDataSet, filtersStore.iter, filtersStore.tag]
  )

  const handleRemoveRowData = useCallback(
    (item, removeData, content) => {
      const newStoreSelectedRowData = {
        ...content
      }
      const newPageDataSelectedRowData = { ...pageData.selectedRowData }

      delete newStoreSelectedRowData[item.key.identifier]
      delete newPageDataSelectedRowData[item.key.identifier]

      removeData(newStoreSelectedRowData)
      setPageData(state => ({
        ...state,
        selectedRowData: newPageDataSelectedRowData
      }))
    },
    [pageData.selectedRowData]
  )

  const handleRemoveDataSet = useCallback(
    dataSet => {
      handleRemoveRowData(dataSet, removeDataSet, dataSets.selectedRowData.content)
    },
    [dataSets.selectedRowData.content, handleRemoveRowData, removeDataSet]
  )

  const handleRefresh = useCallback(
    filters => {
      getFilterTagOptions(fetchArtifactTags, params.projectName)

      return fetchData(filters)
    },
    [fetchArtifactTags, fetchData, getFilterTagOptions, params.projectName]
  )

  const navigateToDetailsPane = () => {
    const { name, tag, iter } = params
    let content = []

    if (dataSets.allData.length > 0) {
      content = dataSets.selectedRowData.content[name] || dataSets.allData
    }

    if (name && content.length !== 0) {
      const selectedItem = content.find(contentItem => {
        const searchKey = contentItem.name ? 'name' : 'db_key'
        return iter
          ? Number(iter) === contentItem.iter &&
              contentItem[searchKey] === name &&
              (contentItem.tag === tag || contentItem.tree === tag)
          : contentItem[searchKey] === name && (contentItem.tag === tag || contentItem.tree === tag)
      })

      if (!selectedItem) {
        navigate(`/projects/${params.projectName}/datasets}`, { replace: true })
      } else {
        setSelectedItem({ item: selectedItem })
      }
    } else {
      setSelectedItem({})
    }
  }

  useEffect(() => {
    if (openPanelByDefault) {
      openPopUp(RegisterArtifactModal, {
        artifactKind: 'dataset',
        projectName: params.projectName,
        refresh: handleRefresh,
        title: pageData.actionsMenuHeader
      })
    }
  }, [handleRefresh, openPanelByDefault, pageData.actionsMenuHeader, params.projectName])

  useEffect(() => {
    setPageData(state => {
      return {
        ...state,
        ...generatePageData(handleRequestOnExpand, selectedItem)
      }
    })
  }, [handleRequestOnExpand, selectedItem])

  useEffect(() => {
    if (selectedItem.item) {
      setPageData(state => ({
        ...state,
        details: {
          ...state.details,
          menu: generateDataSetsDetailsMenu(selectedItem)
        }
      }))
    }
  }, [selectedItem, selectedItem.item])

  useEffect(() => {
    removeDataSet({})
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.iter, filtersStore.tag, removeDataSet])

  useEffect(() => {
    if (urlTagOption) {
      fetchData({
        tag: urlTagOption,
        iter: SHOW_ITERATIONS
      })
    }
  }, [fetchData, urlTagOption])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS || isEmpty(filtersStore.iter)) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [filtersStore.groupBy, filtersStore.iter, filtersStore.tag, params.name, setFilters])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(DATASETS_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [location, navigate, params, pageData.details.menu])

  useEffect(navigateToDetailsPane, [dataSets, navigate, params, setSelectedItem])

  useEffect(() => {
    return () => {
      setDatasets([])
      removeDataSet({})
      removeDataSets()
      setSelectedItem({})
      setPageData(pageDataInitialState)
      cancelRequest('cancel')
    }
  }, [removeDataSet, removeDataSets, setSelectedItem])

  return (
    <div className="content-wrapper" ref={datasetsRef}>
      {loading && <Loader />}
      <Content
        cancelRequest={cancelRequest}
        content={datasets}
        getIdentifier={getArtifactIdentifier}
        handleCancel={() => setSelectedItem({})}
        handleActionsMenuClick={() =>
          openPopUp(RegisterArtifactModal, {
            artifactKind: 'dataset',
            projectName: params.projectName,
            refresh: handleRefresh,
            title: pageData.actionsMenuHeader
          })
        }
        handleRemoveRequestData={handleRemoveDataSet}
        loading={loading}
        pageData={pageData}
        refresh={handleRefresh}
        selectedItem={selectedItem.item}
      />
    </div>
  )
}

const actionCreators = {
  fetchArtifactTags: artifactsAction.fetchArtifactTags,
  fetchDataSet: artifactsAction.fetchDataSet,
  fetchDataSets: artifactsAction.fetchDataSets,
  getFilterTagOptions: filtersActions.getFilterTagOptions,
  removeDataSet: artifactsAction.removeDataSet,
  removeDataSets: artifactsAction.removeDataSets,
  setFilters: filtersActions.setFilters
}

export default connect(
  ({ artifactsStore, filtersStore }) => ({
    dataSets: artifactsStore.dataSets,
    loading: artifactsStore.loading,
    filtersStore
  }),
  { ...actionCreators }
)(Datasets)
