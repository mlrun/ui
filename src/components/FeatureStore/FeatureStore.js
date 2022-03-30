import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import FeatureSetsPanel from '../FeatureSetsPanel/FeatureSetsPanel'
import AddToFeatureVectorPopUp from '../../elements/AddToFeatureVectorPopUp/AddToFeatureVectorPopUp'
import CreateFeatureVectorPopUp from '../../elements/CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'

import artifactsAction from '../../actions/artifacts'
import featureStoreActions from '../../actions/featureStore'
import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import tableActions from '../../actions/table'
import {
  checkTabIsValid,
  fetchFeatureRowData,
  fetchFeatureSetRowData,
  fetchFeatureVectorRowData,
  generateFeatureSetsDetailsMenu,
  generateFeatureVectorsDetailsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  handleFetchData,
  navigateToDetailsPane,
  pageDataInitialState,
  tabs
} from './featureStore.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getIdentifierMethod } from '../../utils/getUniqueIdentifier'
import { isPageTabValid } from '../../utils/handleRedirect'
import {
  DANGER_BUTTON,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  LABEL_BUTTON,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../../constants'
import { useMode } from '../../hooks/mode.hook'
import { useOpenPanel } from '../../hooks/openPanel.hook'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'

const FeatureStore = ({
  deleteFeatureVector,
  featureStore,
  fetchEntities,
  fetchEntity,
  fetchFeature,
  fetchFeatureSet,
  fetchFeatureSets,
  fetchFeatureSetsTags,
  fetchFeatureVector,
  fetchFeatureVectors,
  fetchFeatureVectorsTags,
  fetchFeatures,
  filtersStore,
  getFilterTagOptions,
  history,
  match,
  removeEntities,
  removeEntity,
  removeFeature,
  removeFeatureSet,
  removeFeatureSets,
  removeFeatureStoreError,
  removeFeatureVector,
  removeFeatureVectors,
  removeFeatures,
  removeNewFeatureSet,
  setFeaturesPanelData,
  setFilters,
  setNotification,
  setTablePanelOpen,
  tableStore,
  updateFeatureStoreData
}) => {
  const [pageData, setPageData] = useState(pageDataInitialState)
  const urlTagOption = useGetTagOptions(
    match.params.pageTab === FEATURE_VECTORS_TAB
      ? fetchFeatureVectorsTags
      : fetchFeatureSetsTags,
    pageData.filters
  )
  const { isStagingMode } = useMode()
  const openPanelByDefault = useOpenPanel()
  const [content, setContent] = useState([])
  const [selectedItem, setSelectedItem] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [featureSetsPanelIsOpen, setFeatureSetsPanelIsOpen] = useState(false)
  const [createVectorPopUpIsOpen, setCreateVectorPopUpIsOpen] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const featureStoreRef = useRef(null)

  const fetchData = useCallback(
    async filters => {
      const data = await handleFetchData(
        featureStoreRef,
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
      fetchFeatureSets,
      fetchFeatures,
      fetchEntities,
      fetchFeatureVectors,
      match.params.projectName,
      match.params.pageTab
    ]
  )

  const cancelRequest = message => {
    featureStoreRef.current?.cancel && featureStoreRef.current.cancel(message)
  }

  const handleRefresh = filters => {
    const fetchTags =
      match.params.pageTab === FEATURE_VECTORS_TAB
        ? fetchFeatureVectorsTags
        : fetchFeatureSetsTags

    getFilterTagOptions(fetchTags, match.params.projectName)

    return fetchData(filters)
  }

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

  const createFeatureVector = featureVectorData => {
    setCreateVectorPopUpIsOpen(false)
    setFeaturesPanelData({
      currentProject: match.params.projectName,
      featureVector: {
        kind: 'FeatureVector',
        metadata: {
          name: featureVectorData.name,
          project: match.params.projectName,
          tag: featureVectorData.tag,
          labels: featureVectorData.labels
        },
        spec: {
          description: featureVectorData.description,
          features: [],
          label_feature: ''
        },
        status: {}
      },
      groupedFeatures: {
        [match.params.projectName]: []
      },
      isNewFeatureVector: true
    })
    history.push(
      `/projects/${match.params.projectName}/feature-store/add-to-feature-vector`
    )
  }
  useEffect(() => {
    return () => {
      setTablePanelOpen(false)
    }
  }, [setTablePanelOpen, match.params.projectName, match.params.pageTab])

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

  const handleRemoveFeatureVector = useCallback(
    featureVector => {
      handleRemoveRowData(
        featureVector,
        removeFeatureVector,
        featureStore.featureVectors.selectedRowData.content
      )
    },
    [
      featureStore.featureVectors.selectedRowData.content,
      handleRemoveRowData,
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

      handleRemoveRowData(feature, removeData, content)
    },
    [
      featureStore.entities.selectedRowData.content,
      featureStore.features.selectedRowData.content,
      handleRemoveRowData,
      removeEntity,
      removeFeature
    ]
  )

  const handleRemoveFeatureSet = useCallback(
    featureSet => {
      handleRemoveRowData(
        featureSet,
        removeFeatureSet,
        featureStore.featureSets.selectedRowData.content
      )
    },
    [
      featureStore.featureSets.selectedRowData.content,
      handleRemoveRowData,
      removeFeatureSet
    ]
  )

  const handleRequestOnExpand = useCallback(
    async item => {
      if (match.params.pageTab === FEATURES_TAB) {
        const fetchData =
          item.ui?.type === 'feature' ? fetchFeature : fetchEntity
        await fetchFeatureRowData(fetchData, item, setPageData)
      } else if (match.params.pageTab === FEATURE_VECTORS_TAB) {
        await fetchFeatureVectorRowData(
          fetchFeatureVector,
          item,
          setPageData,
          filtersStore.tag
        )
      } else if (match.params.pageTab === FEATURE_SETS_TAB) {
        await fetchFeatureSetRowData(
          fetchFeatureSet,
          item,
          setPageData,
          filtersStore.tag
        )
      }
    },
    [
      fetchEntity,
      fetchFeature,
      fetchFeatureSet,
      fetchFeatureVector,
      filtersStore.tag,
      match.params.pageTab
    ]
  )

  const handleDeleteFeatureVector = useCallback(
    featureVector => {
      deleteFeatureVector(match.params.projectName, featureVector.name)
        .then(() => {
          if (!isEmpty(selectedItem)) {
            setSelectedItem({})
            history.replace(
              `/projects/${match.params.projectName}/feature-store/feature-vectors`
            )
          }

          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Feature vector deleted successfully'
          })

          getFilterTagOptions(
            fetchFeatureVectorsTags,
            match.params.projectName
          ).then(response => {
            const tag = [...response.payload, TAG_FILTER_ALL_ITEMS].includes(
              filtersStore.tag
            )
              ? filtersStore.tag
              : TAG_FILTER_LATEST

            setFilters({ tag })
            fetchData({ ...filtersStore, tag })
          })
        })
        .catch(() => {
          setNotification({
            status: 400,
            id: Math.random(),
            retry: () => handleDeleteFeatureVector(featureVector),
            message: 'Feature vector failed to delete'
          })
        })

      setConfirmData(null)
    },
    [
      deleteFeatureVector,
      fetchData,
      fetchFeatureVectorsTags,
      filtersStore,
      getFilterTagOptions,
      history,
      match.params.projectName,
      selectedItem,
      setFilters,
      setNotification
    ]
  )

  const onDeleteFeatureVector = useCallback(
    featureVector => {
      setConfirmData({
        item: featureVector,
        header: 'Delete feature vector?',
        message: `You try to delete feature vector "${featureVector.name}". Deleted feature vectors cannot be restored.`,
        btnCancelLabel: 'Cancel',
        btnCancelVariant: LABEL_BUTTON,
        btnConfirmLabel: 'Delete',
        btnConfirmVariant: DANGER_BUTTON,
        rejectHandler: () => setConfirmData(null),
        confirmHandler: () => handleDeleteFeatureVector(featureVector)
      })
    },
    [handleDeleteFeatureVector]
  )

  useEffect(() => {
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.tag])

  useEffect(() => {
    if (urlTagOption) {
      fetchData({
        tag: urlTagOption,
        iter: ''
      })
    }
  }, [fetchData, match.params.pageTab, urlTagOption])

  useEffect(() => {
    return () => {
      setContent([])
      removeFeatures()
      removeEntities()
      removeFeatureSets()
      removeFeatureVectors()
      setSelectedItem({})
      setPageData(pageDataInitialState)
      cancelRequest('cancel')
    }
  }, [
    match.params.pageTab,
    removeEntities,
    removeFeatureSets,
    removeFeatureVectors,
    removeFeatures
  ])

  useEffect(() => {
    if (
      filtersStore.tag === TAG_FILTER_ALL_ITEMS ||
      filtersStore.tag === TAG_FILTER_LATEST
    ) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [filtersStore.groupBy, filtersStore.tag, match.params.pageTab, setFilters])

  useEffect(() => {
    setPageData(state => {
      return {
        ...state,
        ...generatePageData(
          match.params.pageTab,
          handleRequestOnExpand,
          onDeleteFeatureVector,
          getPopUpTemplate,
          tableStore.isTablePanelOpen,
          !isEveryObjectValueEmpty(selectedItem),
          isStagingMode
        )
      }
    })
  }, [
    getPopUpTemplate,
    handleRequestOnExpand,
    isStagingMode,
    match.params.pageTab,
    onDeleteFeatureVector,
    selectedItem,
    tableStore.isTablePanelOpen
  ])

  useEffect(() => {
    const handleRemoveRequestData =
      match.params.pageTab === FEATURE_VECTORS_TAB
        ? handleRemoveFeatureVector
        : match.params.pageTab === FEATURES_TAB
        ? handleRemoveFeature
        : handleRemoveFeatureSet

    setPageData(state => ({
      ...state,
      handleRemoveRequestData
    }))
  }, [
    handleRemoveFeature,
    handleRemoveFeatureSet,
    handleRemoveFeatureVector,
    handleRequestOnExpand,
    match.params.pageTab
  ])

  useEffect(() => {
    navigateToDetailsPane(
      featureStore.featureSets,
      featureStore.features.allData,
      featureStore.entities.allData,
      featureStore.featureVectors,
      history,
      match,
      setSelectedItem
    )
  }, [
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
      pageData.details.menu.length > 0
    ) {
      isDetailsTabExists(
        FEATURE_STORE_PAGE,
        match,
        pageData.details.menu,
        history
      )
    }
  }, [history, match, pageData.details.menu])

  useEffect(() => {
    checkTabIsValid(history, match, selectedItem)

    if (selectedItem.item) {
      setPageData(state => {
        if (match.params.pageTab === FEATURE_SETS_TAB) {
          return {
            ...state,
            details: {
              ...state.details,
              menu: [...generateFeatureSetsDetailsMenu(selectedItem)],
              type: FEATURE_SETS_TAB
            }
          }
        } else if (match.params.pageTab === FEATURE_VECTORS_TAB) {
          return {
            ...state,
            details: {
              ...state.details,
              menu: [...generateFeatureVectorsDetailsMenu(selectedItem)],
              type: FEATURE_VECTORS_TAB
            }
          }
        }

        return { ...state }
      })
    }
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
    isPageTabValid(
      match,
      tabs.map(tab => tab.id),
      history
    )
  }, [history, match])

  useEffect(() => {
    if (openPanelByDefault) {
      switch (match.params.pageTab) {
        case FEATURE_SETS_TAB:
          return setFeatureSetsPanelIsOpen(true)
        case FEATURE_VECTORS_TAB:
          return setCreateVectorPopUpIsOpen(true)
        default:
          return
      }
    }
  }, [openPanelByDefault, match.params.pageTab])

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

  const handleActionsMenuClick = () => {
    switch (match.params.pageTab) {
      case FEATURE_SETS_TAB:
        return setFeatureSetsPanelIsOpen(true)
      case FEATURE_VECTORS_TAB:
        return setCreateVectorPopUpIsOpen(true)
      default:
        return null
    }
  }

  const createFeatureSetSuccess = tag => {
    const currentTag =
      filtersStore.tag === TAG_FILTER_ALL_ITEMS ? TAG_FILTER_ALL_ITEMS : tag

    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()
    setFilters({
      name: '',
      labels: '',
      tag: currentTag
    })

    return handleRefresh({
      project: match.params.projectName,
      tag: currentTag
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
    <div ref={featureStoreRef} className="content-wrapper">
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: confirmData.btnCancelLabel,
            variant: confirmData.btnCancelVariant
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmVariant
          }}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}
      {(featureStore.loading ||
        featureStore.entities.loading ||
        featureStore.features.loading) && <Loader />}
      <Content
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={cancelRequest}
        content={content}
        handleCancel={() => setSelectedItem({})}
        loading={
          featureStore.loading ||
          featureStore.entities.loading ||
          featureStore.features.loading
        }
        match={match}
        handleActionsMenuClick={handleActionsMenuClick}
        pageData={pageData}
        refresh={handleRefresh}
        selectedItem={selectedItem.item}
        getIdentifier={getIdentifierMethod(match.params.pageTab)}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactKind={match.params.pageTab.slice(0, -1)}
          match={match}
          refresh={handleRefresh}
          setIsPopupOpen={setIsPopupDialogOpen}
          title={pageData.actionsMenuHeader}
        />
      )}
      {featureSetsPanelIsOpen && (
        <FeatureSetsPanel
          closePanel={closePanel}
          createFeatureSetSuccess={createFeatureSetSuccess}
          project={match.params.projectName}
        />
      )}
      {createVectorPopUpIsOpen && (
        <CreateFeatureVectorPopUp
          closePopUp={() => {
            setCreateVectorPopUpIsOpen(false)
          }}
          createFeatureVector={createFeatureVector}
        />
      )}
    </div>
  )
}

FeatureStore.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ tableStore, filtersStore, featureStore }) => ({
    tableStore,
    filtersStore,
    featureStore
  }),
  {
    ...artifactsAction,
    ...featureStoreActions,
    ...notificationActions,
    ...filtersActions,
    ...tableActions
  }
)(FeatureStore)
