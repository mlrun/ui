import React, { useCallback, useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactsAction from '../../actions/artifacts'
import {
  checkTabIsValid,
  detailsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  handleFetchData,
  navigateToDetailsPane
} from './feaureStore.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import {
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB
} from '../../constants'
import notificationActions from '../../actions/notification'

const FeatureStore = ({
  artifactsStore,
  fetchDataSets,
  fetchFeatureSets,
  fetchFeatureVector,
  fetchFeatureVectors,
  fetchFeatures,
  history,
  match,
  removeDataSets,
  removeFeatureSets,
  removeFeatureVector,
  removeFeatureVectors,
  setArtifactFilter,
  setNotification,
  updateFeatureSetData
}) => {
  const [content, setContent] = useState([])
  const [yamlContent, setYamlContent] = useState([])
  const [groupFilter, setGroupFilter] = useState('')
  const [selectedItem, setSelectedItem] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    detailsMenu: [],
    filters: [],
    infoHeaders: [],
    page: '',
    registerArtifactDialogTitle: '',
    tabs: []
  })
  const featureStoreRef = useRef(null)

  const fetchData = useCallback(
    async item => {
      const data = await handleFetchData(
        featureStoreRef,
        fetchDataSets,
        fetchFeatureSets,
        fetchFeatures,
        fetchFeatureVectors,
        item,
        match.params.pageTab
      )

      if (data.content.length > 0) {
        setContent(data.content)
        setYamlContent(data.yamlContent)
      }

      return data.yamlContent
    },
    [
      match.params.pageTab,
      fetchDataSets,
      fetchFeatureSets,
      fetchFeatures,
      fetchFeatureVectors
    ]
  )

  const handleRemoveFeatureVector = useCallback(
    featureVector => {
      const newSelectedRowData = {
        ...artifactsStore.featureVectors.selectedRowData
      }

      delete newSelectedRowData[featureVector.name]

      removeFeatureVector(newSelectedRowData)
    },
    [artifactsStore.featureVectors.selectedRowData, removeFeatureVector]
  )

  const handleRequestOnExpand = useCallback(
    featureVector => {
      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          loading: true
        }
      }))

      fetchFeatureVector(featureVector.name, match.params.projectName)
        .then(result => {
          setPageData(state => ({
            ...state,
            selectedRowData: {
              content: {
                [featureVector.name]: [...result]
              },
              error: null,
              loading: false
            }
          }))
          setYamlContent(result)
        })
        .catch(error =>
          setPageData(state => ({
            ...state,
            selectedRowData: {
              ...state.selectedRowData,
              error,
              loading: false
            }
          }))
        )
    },
    [fetchFeatureVector, match.params.projectName]
  )

  const handleExpandRow = useCallback(
    (item, isCollapse) => {
      if (match.params.pageTab === FEATURE_VECTORS_TAB && isCollapse) {
        setYamlContent(artifactsStore.featureVectors.allData)
      }
    },
    [artifactsStore.featureVectors.allData, match.params.pageTab]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setContent([])
      setYamlContent([])
      setGroupFilter('')
      removeDataSets()
      removeFeatureSets()
      removeFeatureVectors()
      setSelectedItem({})
    }
  }, [
    fetchData,
    match.params.projectName,
    removeDataSets,
    removeFeatureSets,
    featureStoreRef,
    removeFeatureVectors
  ])

  useEffect(() => {
    if (
      match.params.pageTab === FEATURE_SETS_TAB ||
      (match.params.pageTab === FEATURE_VECTORS_TAB &&
        artifactsStore.filter.tag === 'latest')
    ) {
      setGroupFilter('name')
    } else if (groupFilter.length > 0) {
      setGroupFilter('')
    }
  }, [match.params.pageTab, groupFilter.length, artifactsStore.filter])

  useEffect(() => {
    setPageData(
      generatePageData(
        match.params.pageTab,
        handleRequestOnExpand,
        handleRemoveFeatureVector
      )
    )
  }, [handleRemoveFeatureVector, handleRequestOnExpand, match.params.pageTab])

  useEffect(() => {
    navigateToDetailsPane(artifactsStore, history, match, setSelectedItem)
  }, [
    match.params,
    artifactsStore.artifacts,
    history,
    artifactsStore.dataSets,
    artifactsStore.featureSets,
    artifactsStore.features,
    artifactsStore.featureVectors,
    artifactsStore,
    match
  ])

  useEffect(() => {
    checkTabIsValid(history, match, selectedItem)

    setPageData(state => {
      const newDetailsMenu = [...detailsMenu]

      if (match.params.pageTab === FEATURE_SETS_TAB) {
        newDetailsMenu.splice(1, 0, 'transforamations')
      }

      if (selectedItem.item?.schema || selectedItem.item?.entities) {
        if (match.params.pageTab === FEATURE_SETS_TAB) {
          newDetailsMenu.push('features')
        } else if (match.params.pageTab === DATASETS_TAB) {
          newDetailsMenu.push('metadata')
        }
      }

      if (
        selectedItem.item?.entities &&
        selectedItem.item?.stats &&
        match.params.pageTab === FEATURE_SETS_TAB
      ) {
        newDetailsMenu.push('statistics')
      }

      if (
        selectedItem.item?.extra_data ||
        match.params.pageTab === FEATURE_SETS_TAB
      ) {
        newDetailsMenu.push('analysis')
      }

      return {
        ...state,
        detailsMenu: [...newDetailsMenu]
      }
    })
  }, [
    match.params.tab,
    match.params.projectName,
    match.params.name,
    history,
    selectedItem.item,
    match.params.pageTab,
    match.params.tag,
    selectedItem.entities,
    match,
    selectedItem
  ])

  const handleTreeFilterChange = useCallback(
    item => {
      if (match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}`
        )

        handleArtifactTreeFilterChange(
          fetchData,
          artifactsStore.filter,
          item,
          match.params.projectName,
          setArtifactFilter
        )
      }
    },
    [
      artifactsStore.filter,
      fetchData,
      history,
      match.params.name,
      match.params.pageTab,
      match.params.projectName,
      setArtifactFilter
    ]
  )

  const applyDetailsChanges = changes => {
    handleApplyDetailsChanges(
      changes,
      fetchData,
      match,
      selectedItem,
      setNotification,
      updateFeatureSetData
    )
  }

  return (
    <div ref={featureStoreRef}>
      {artifactsStore.loading && <Loader />}
      <Content
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={message => {
          featureStoreRef.current?.cancel &&
            featureStoreRef.current.cancel(message)
        }}
        content={content}
        expandRow={handleExpandRow}
        groupFilter={groupFilter}
        handleArtifactFilterTree={handleTreeFilterChange}
        handleCancel={() => setSelectedItem({})}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={item => {
          fetchData(item)
        }}
        selectedItem={selectedItem.item}
        yamlContent={yamlContent}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactFilter={artifactsStore.filter}
          match={match}
          pageData={pageData}
          refresh={fetchData}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
          title={pageData.registerArtifactDialogTitle}
        />
      )}
    </div>
  )
}

FeatureStore.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction,
  ...notificationActions
})(FeatureStore)
