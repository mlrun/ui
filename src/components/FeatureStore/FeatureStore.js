import React, { useCallback, useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import FeatureSetsPanel from '../FeatureSetsPanel/FeatureSetsPanel'
import AddToFeatureVectorPopUp from '../../elements/AddToFeatureVectorPopUp/AddToFeatureVectorPopUp'

import artifactsAction from '../../actions/artifacts'
import featureStoreActions from '../../actions/featureStore'
import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import {
  checkTabIsValid,
  fetchDataSetRowData,
  fetchFeatureRowData,
  fetchFeatureVectorRowData,
  generateDataSetsDetailsMenu,
  generateFeatureSetsDetailsMenu,
  generateFeatureVectorsDetailsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  handleFetchData,
  navigateToDetailsPane,
  pageDataInitialState
} from './featureStore.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getIdentifierMethod } from '../../utils/getUniqueIdentifier'
import {
  DATASETS_TAB,
  FEATURES_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  INIT_GROUP_FILTER,
  INIT_TAG_FILTER,
  FEATURE_STORE_PAGE
} from '../../constants'

import './featureStore.scss'

const FeatureStore = ({
  artifactsStore,
  featureStore,
  fetchArtifactTags,
  fetchDataSet,
  fetchDataSets,
  fetchEntities,
  fetchEntity,
  fetchFeature,
  fetchFeatureSets,
  fetchFeatureVector,
  fetchFeatureVectors,
  fetchFeatures,
  filtersStore,
  getFeatureVectorsTags,
  getFilterTagOptions,
  history,
  match,
  removeDataSet,
  removeDataSets,
  removeEntities,
  removeEntity,
  removeFeature,
  removeFeatureSets,
  removeFeatureStoreError,
  removeFeatureVector,
  removeFeatureVectors,
  removeFeatures,
  removeNewFeatureSet,
  setFilters,
  setNotification,
  tableStore,
  updateFeatureStoreData
}) => {
  const [content, setContent] = useState([])
  const [selectedItem, setSelectedItem] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [featureSetsPanelIsOpen, setFeatureSetsPanelIsOpen] = useState(false)
  const [pageData, setPageData] = useState(pageDataInitialState)
  const featureStoreRef = useRef(null)

  const fetchData = useCallback(
    async filters => {
      const data = await handleFetchData(
        featureStoreRef,
        fetchDataSets,
        fetchFeatureSets,
        fetchFeatures,
        fetchEntities,
        fetchFeatureVectors,
        filters,
        match.params.projectName,
        match.params.pageTab
      )

      if (data.content) {
        setContent(data.content)
      }

      return data.originalContent
    },
    [
      fetchDataSets,
      fetchFeatureSets,
      fetchFeatures,
      fetchEntities,
      fetchFeatureVectors,
      match.params.projectName,
      match.params.pageTab
    ]
  )

  const getPopUpTemplate = useCallback(
    action => {
      return (
        <AddToFeatureVectorPopUp
          action={action}
          currentProject={match.params.projectName}
          fetchFeatureVectors={fetchFeatureVectors}
        />
      )
    },
    [fetchFeatureVectors, match.params.projectName]
  )

  const handleRemoveFeatureVector = useCallback(
    featureVector => {
      const newStoreSelectedRowData = {
        ...featureStore.featureVectors.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...pageData.selectedRowData }

      delete newStoreSelectedRowData[featureVector.key.identifier]
      delete newPageDataSelectedRowData[featureVector.key.identifier]

      removeFeatureVector(newStoreSelectedRowData)
      setPageData(state => ({
        ...state,
        selectedRowData: newPageDataSelectedRowData
      }))
    },
    [
      featureStore.featureVectors.selectedRowData.content,
      pageData.selectedRowData,
      removeFeatureVector
    ]
  )

  const handleRemoveFeature = useCallback(
    feature => {
      const content =
        feature.key.type === 'feature'
          ? featureStore.features.selectedRowData.content
          : featureStore.entities.selectedRowData.content
      const removeData =
        feature.key.type === 'feature' ? removeFeature : removeEntity
      const newStoreSelectedRowData = {
        ...content
      }
      const newPageDataSelectedRowData = { ...pageData.selectedRowData }

      delete newStoreSelectedRowData[feature.key.identifier]
      delete newPageDataSelectedRowData[feature.key.identifier]

      removeData(newStoreSelectedRowData)
      setPageData(state => ({
        ...state,
        selectedRowData: newPageDataSelectedRowData
      }))
    },
    [
      featureStore.entities.selectedRowData.content,
      featureStore.features.selectedRowData.content,
      pageData.selectedRowData,
      removeEntity,
      removeFeature
    ]
  )

  const handleRemoveDataSet = useCallback(
    dataSet => {
      const newStoreSelectedRowData = {
        ...artifactsStore.dataSets.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...pageData.selectedRowData }

      delete newStoreSelectedRowData[dataSet.key.value]
      delete newPageDataSelectedRowData[dataSet.key.value]

      removeDataSet(newStoreSelectedRowData)
      setPageData(state => ({
        ...state,
        selectedRowData: newPageDataSelectedRowData
      }))
    },
    [
      artifactsStore.dataSets.selectedRowData.content,
      pageData.selectedRowData,
      removeDataSet
    ]
  )

  const handleRequestOnExpand = useCallback(
    async item => {
      if (match.params.pageTab === FEATURES_TAB) {
        const fetchData =
          item.ui?.type === 'feature' ? fetchFeature : fetchEntity
        await fetchFeatureRowData(fetchData, item, setPageData)
      } else if (match.params.pageTab === FEATURE_VECTORS_TAB) {
        await fetchFeatureVectorRowData(fetchFeatureVector, item, setPageData)
      } else if (match.params.pageTab === DATASETS_TAB) {
        await fetchDataSetRowData(
          fetchDataSet,
          item,
          setPageData,
          !filtersStore.iter
        )
      }
    },
    [
      fetchDataSet,
      fetchEntity,
      fetchFeature,
      fetchFeatureVector,
      filtersStore.iter,
      match.params.pageTab
    ]
  )

  useEffect(() => {
    removeDataSet({})
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.iter, removeDataSet])

  useEffect(() => {
    fetchData({
      tag: INIT_TAG_FILTER,
      iter: match.params.pageTab === DATASETS_TAB ? 'iter' : ''
    })

    return () => {
      setContent([])
      removeDataSets()
      removeFeatures()
      removeEntities()
      removeFeatureSets()
      removeFeatureVectors()
      setSelectedItem({})
      setPageData(pageDataInitialState)
    }
  }, [
    fetchData,
    match.params.pageTab,
    removeDataSets,
    removeFeatureSets,
    removeFeatureVectors,
    removeFeatures,
    removeEntities
  ])

  useEffect(() => {
    if (
      match.params.pageTab === FEATURE_SETS_TAB ||
      filtersStore.tag === INIT_TAG_FILTER
    ) {
      setFilters({ groupBy: INIT_GROUP_FILTER })
    } else if (filtersStore.groupBy === INIT_GROUP_FILTER) {
      setFilters({ groupBy: 'none' })
    }
  }, [filtersStore.groupBy, filtersStore.tag, match.params.pageTab, setFilters])

  useEffect(() => {
    setPageData(state => {
      return {
        ...state,
        ...generatePageData(
          match.params.pageTab,
          handleRequestOnExpand,
          match.params.pageTab === FEATURE_VECTORS_TAB
            ? handleRemoveFeatureVector
            : match.params.pageTab === FEATURES_TAB
            ? handleRemoveFeature
            : handleRemoveDataSet,
          getPopUpTemplate,
          tableStore.isTablePanelOpen
        )
      }
    })
  }, [
    getPopUpTemplate,
    handleRemoveDataSet,
    handleRemoveFeature,
    handleRemoveFeatureVector,
    handleRequestOnExpand,
    match.params.pageTab,
    tableStore.isTablePanelOpen
  ])

  useEffect(() => {
    navigateToDetailsPane(
      featureStore.featureSets,
      featureStore.features.allData,
      featureStore.entities.allData,
      artifactsStore.dataSets,
      featureStore.featureVectors,
      history,
      match,
      setSelectedItem
    )
  }, [
    artifactsStore.dataSets,
    featureStore.featureSets,
    featureStore.featureVectors,
    featureStore.features.allData,
    featureStore.entities.allData,
    history,
    match
  ])

  useEffect(() => {
    if (
      match.params.name &&
      match.params.tag &&
      pageData.detailsMenu.length > 0
    ) {
      isDetailsTabExists(
        FEATURE_STORE_PAGE,
        match.params,
        pageData.detailsMenu,
        history
      )
    }
  }, [history, match.params, pageData.detailsMenu])

  useEffect(() => {
    checkTabIsValid(history, match, selectedItem)

    setPageData(state => {
      if (match.params.pageTab === FEATURE_SETS_TAB) {
        return {
          ...state,
          detailsMenu: [...generateFeatureSetsDetailsMenu(selectedItem)]
        }
      } else if (match.params.pageTab === FEATURE_VECTORS_TAB) {
        return {
          ...state,
          detailsMenu: [...generateFeatureVectorsDetailsMenu(selectedItem)]
        }
      } else if (match.params.pageTab === DATASETS_TAB) {
        return {
          ...state,
          detailsMenu: [...generateDataSetsDetailsMenu(selectedItem)]
        }
      }

      return { ...state }
    })
  }, [
    history,
    selectedItem.item,
    selectedItem.entities,
    match.params.pageTab,
    selectedItem,
    match
  ])

  useEffect(() => setContent([]), [filtersStore.tag])

  useEffect(() => {
    if (filtersStore.tagOptions.length === 0) {
      if (match.params.pageTab === DATASETS_TAB) {
        getFilterTagOptions(fetchArtifactTags, match.params.projectName)
      } else if (match.params.pageTab === FEATURE_VECTORS_TAB) {
        getFilterTagOptions(getFeatureVectorsTags, match.params.projectName)
      }
    }
  }, [
    fetchArtifactTags,
    filtersStore.tagOptions.length,
    getFeatureVectorsTags,
    getFilterTagOptions,
    match.params.pageTab,
    match.params.projectName
  ])

  const applyDetailsChanges = changes => {
    return handleApplyDetailsChanges(
      changes,
      fetchData,
      match,
      selectedItem,
      setNotification,
      updateFeatureStoreData,
      filtersStore
    )
  }

  const openPopupDialog = () => {
    switch (match.params.pageTab) {
      case DATASETS_TAB:
        return setIsPopupDialogOpen(true)
      case FEATURE_SETS_TAB:
        return setFeatureSetsPanelIsOpen(true)
      default:
        return null
    }
  }

  const createFeatureSetSuccess = () => {
    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()

    return fetchData({
      project: match.params.projectName,
      tag: INIT_TAG_FILTER
    }).then(() => {
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Feature set successfully created'
      })
    })
  }

  const closePanel = () => {
    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()

    if (featureStore.error) {
      removeFeatureStoreError()
    }
  }

  return (
    <div ref={featureStoreRef} className="feature-store-container">
      {(featureStore.loading || artifactsStore.loading) && <Loader />}
      <Content
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={message => {
          featureStoreRef.current?.cancel &&
            featureStoreRef.current.cancel(message)
        }}
        content={content}
        handleCancel={() => setSelectedItem({})}
        loading={
          match.params.pageTab === DATASETS_TAB
            ? artifactsStore.loading
            : featureStore.loading
        }
        match={match}
        openPopupDialog={openPopupDialog}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedItem.item}
        getIdentifier={getIdentifierMethod(match.params.pageTab)}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactKind={match.params.pageTab.slice(0, -1)}
          match={match}
          refresh={fetchData}
          setIsPopupOpen={setIsPopupDialogOpen}
          title={pageData.registerArtifactDialogTitle}
        />
      )}
      {featureSetsPanelIsOpen && (
        <FeatureSetsPanel
          closePanel={closePanel}
          createFeatureSetSuccess={createFeatureSetSuccess}
          project={match.params.projectName}
        />
      )}
    </div>
  )
}

FeatureStore.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ artifactsStore, tableStore, filtersStore, featureStore }) => ({
    artifactsStore,
    tableStore,
    filtersStore,
    featureStore
  }),
  {
    ...artifactsAction,
    ...featureStoreActions,
    ...notificationActions,
    ...filtersActions
  }
)(FeatureStore)
