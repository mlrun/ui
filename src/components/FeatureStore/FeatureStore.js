import React, { useCallback, useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import FeatureSetsPanel from '../FeatureSetsPanel/FeatureSetsPanel'
import AddToFeatureVectorPopUp from '../../elements/AddToFeatureVectorPopUp/AddToFeatureVectorPopUp'

import artifactsAction from '../../actions/artifacts'
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
  fetchDataSet,
  fetchDataSets,
  fetchFeature,
  fetchFeatureSets,
  fetchFeatureVector,
  fetchFeatureVectors,
  fetchFeatures,
  filtersStore,
  history,
  match,
  removeArtifactsError,
  removeDataSet,
  removeDataSets,
  removeFeature,
  removeFeatureSets,
  removeFeatureVector,
  removeFeatureVectors,
  removeNewFeatureSet,
  setFilters,
  setNotification,
  tableStore,
  updateFeatureStoreData
}) => {
  const [content, setContent] = useState([])
  const [yamlContent, setYamlContent] = useState({
    allData: [],
    selectedRowData: []
  })
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
        fetchFeatureVectors,
        filters,
        match.params.projectName,
        match.params.pageTab
      )

      if (data.content) {
        setContent(data.content)
        setYamlContent(state => ({ ...state, allData: data.yamlContent }))
      }

      return data.yamlContent
    },
    [
      match.params.pageTab,
      fetchDataSets,
      fetchFeatureSets,
      fetchFeatures,
      fetchFeatureVectors,
      match.params.projectName
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
      const newSelectedRowData = {
        ...artifactsStore.featureVectors.selectedRowData
      }

      delete newSelectedRowData[featureVector.name]

      removeFeatureVector(newSelectedRowData)
    },
    [artifactsStore.featureVectors.selectedRowData, removeFeatureVector]
  )

  const handleRemoveFeature = useCallback(
    feature => {
      const newSelectedRowData = {
        ...artifactsStore.features.selectedRowData
      }

      delete newSelectedRowData[`${feature.name}-${feature.metadata.name}`]

      removeFeature(newSelectedRowData)
    },
    [artifactsStore.features.selectedRowData, removeFeature]
  )

  const handleRemoveDataSet = useCallback(
    dataSet => {
      const newSelectedRowData = {
        ...artifactsStore.dataSets.selectedRowData
      }

      delete newSelectedRowData[dataSet.db_key]

      removeDataSet(newSelectedRowData)
    },
    [artifactsStore.dataSets.selectedRowData, removeDataSet]
  )

  const handleRequestOnExpand = useCallback(
    async item => {
      if (match.params.pageTab === FEATURES_TAB) {
        await fetchFeatureRowData(
          fetchFeature,
          item,
          setPageData,
          setYamlContent
        )
      } else if (match.params.pageTab === FEATURE_VECTORS_TAB) {
        await fetchFeatureVectorRowData(
          fetchFeatureVector,
          item,
          setPageData,
          setYamlContent
        )
      } else if (match.params.pageTab === DATASETS_TAB) {
        await fetchDataSetRowData(
          fetchDataSet,
          item,
          setPageData,
          setYamlContent,
          !filtersStore.iter
        )
      }
    },
    [
      fetchDataSet,
      fetchFeature,
      fetchFeatureVector,
      filtersStore.iter,
      match.params.pageTab
    ]
  )

  const handleExpandRow = useCallback(
    (item, isCollapse) => {
      if (match.params.pageTab !== FEATURE_SETS_TAB && isCollapse) {
        setYamlContent(state => ({
          ...state,
          selectedRowData: []
        }))
      }
    },
    [match.params.pageTab]
  )

  useEffect(() => {
    fetchData({
      tag: INIT_TAG_FILTER,
      iter: match.params.pageTab === DATASETS_TAB ? 'iter' : ''
    })

    return () => {
      setContent([])
      setYamlContent({
        allData: [],
        selectedRowData: []
      })
      removeDataSets()
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
    removeFeatureVectors
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
    handleRemoveFeatureVector,
    handleRequestOnExpand,
    handleRemoveFeature,
    match.params.pageTab,
    handleRemoveDataSet,
    getPopUpTemplate,
    tableStore.isTablePanelOpen
  ])

  useEffect(() => {
    navigateToDetailsPane(artifactsStore, history, match, setSelectedItem)
  }, [history, artifactsStore, match])

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

    if (artifactsStore.error) {
      removeArtifactsError()
    }
  }

  return (
    <div ref={featureStoreRef} className="feature-store-container">
      {artifactsStore.loading && <Loader />}
      <Content
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={message => {
          featureStoreRef.current?.cancel &&
            featureStoreRef.current.cancel(message)
        }}
        content={content}
        expandRow={handleExpandRow}
        handleCancel={() => setSelectedItem({})}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={openPopupDialog}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedItem.item}
        yamlContent={yamlContent}
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
  ({ artifactsStore, tableStore, filtersStore }) => ({
    artifactsStore,
    tableStore,
    filtersStore
  }),
  {
    ...artifactsAction,
    ...notificationActions,
    ...filtersActions
  }
)(FeatureStore)
