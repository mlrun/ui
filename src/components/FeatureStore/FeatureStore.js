import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

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
import { setFeaturesPanelData, setTablePanelOpen } from '../../reducers/tableReducer'

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
  setFilters,
  setNotification,
  updateFeatureStoreData
}) => {
  const params = useParams()
  const [pageData, setPageData] = useState(pageDataInitialState)
  const urlTagOption = useGetTagOptions(
    params.pageTab === FEATURE_VECTORS_TAB ? fetchFeatureVectorsTags : fetchFeatureSetsTags,
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
  const navigate = useNavigate()
  const location = useLocation()
  const tableStore = useSelector(store => store.tableStore)
  const dispatch = useDispatch()

  const fetchData = useCallback(
    async filters => {
      const data = await handleFetchData(
        featureStoreRef,
        fetchFeatureSets,
        fetchFeatures,
        fetchEntities,
        fetchFeatureVectors,
        filters,
        params.projectName,
        params.pageTab
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
      params.projectName,
      params.pageTab
    ]
  )

  const cancelRequest = message => {
    featureStoreRef.current?.cancel && featureStoreRef.current.cancel(message)
  }

  const handleRefresh = filters => {
    const fetchTags =
      params.pageTab === FEATURE_VECTORS_TAB ? fetchFeatureVectorsTags : fetchFeatureSetsTags

    getFilterTagOptions(fetchTags, params.projectName)

    return fetchData(filters)
  }

  const getPopUpTemplate = useCallback(
    action => {
      return (
        <AddToFeatureVectorPopUp
          action={action}
          currentProject={params.projectName}
          fetchFeatureVectors={fetchFeatureVectors}
        />
      )
    },
    [fetchFeatureVectors, params.projectName]
  )

  const createFeatureVector = featureVectorData => {
    setCreateVectorPopUpIsOpen(false)
    dispatch(
      setFeaturesPanelData({
        currentProject: params.projectName,
        featureVector: {
          kind: 'FeatureVector',
          metadata: {
            name: featureVectorData.name,
            project: params.projectName,
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
          [params.projectName]: []
        },
        isNewFeatureVector: true
      })
    )
    navigate(`/projects/${params.projectName}/feature-store/add-to-feature-vector`)
  }
  useEffect(() => {
    return () => {
      dispatch(setTablePanelOpen(false))
    }
  }, [params.projectName, params.pageTab, dispatch])

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
    [featureStore.featureVectors.selectedRowData.content, handleRemoveRowData, removeFeatureVector]
  )

  const handleRemoveFeature = useCallback(
    feature => {
      const content =
        feature.key.type === 'feature'
          ? featureStore.features.selectedRowData.content
          : featureStore.entities.selectedRowData.content
      const removeData = feature.key.type === 'feature' ? removeFeature : removeEntity

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
    [featureStore.featureSets.selectedRowData.content, handleRemoveRowData, removeFeatureSet]
  )

  const handleRequestOnExpand = useCallback(
    async item => {
      if (params.pageTab === FEATURES_TAB) {
        const fetchData = item.ui?.type === 'feature' ? fetchFeature : fetchEntity
        await fetchFeatureRowData(fetchData, item, setPageData)
      } else if (params.pageTab === FEATURE_VECTORS_TAB) {
        await fetchFeatureVectorRowData(fetchFeatureVector, item, setPageData, filtersStore.tag)
      } else if (params.pageTab === FEATURE_SETS_TAB) {
        await fetchFeatureSetRowData(fetchFeatureSet, item, setPageData, filtersStore.tag)
      }
    },
    [
      fetchEntity,
      fetchFeature,
      fetchFeatureSet,
      fetchFeatureVector,
      filtersStore.tag,
      params.pageTab
    ]
  )

  const handleDeleteFeatureVector = useCallback(
    featureVector => {
      deleteFeatureVector(params.projectName, featureVector.name)
        .then(() => {
          if (!isEmpty(selectedItem)) {
            setSelectedItem({})
            navigate(`/projects/${params.projectName}/feature-store/feature-vectors`, {
              replace: true
            })
          }

          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Feature vector deleted successfully'
          })

          getFilterTagOptions(fetchFeatureVectorsTags, params.projectName).then(response => {
            const tag = [...response.payload, TAG_FILTER_ALL_ITEMS].includes(filtersStore.tag)
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
      navigate,
      params.projectName,
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
  }, [fetchData, params.pageTab, urlTagOption])

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
  }, [params.pageTab, removeEntities, removeFeatureSets, removeFeatureVectors, removeFeatures])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS || filtersStore.tag === TAG_FILTER_LATEST) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [filtersStore.groupBy, filtersStore.tag, params.pageTab, setFilters])

  useEffect(() => {
    setPageData(state => {
      return {
        ...state,
        ...generatePageData(
          params.pageTab,
          handleRequestOnExpand,
          params.pageTab === FEATURE_VECTORS_TAB
            ? handleRemoveFeatureVector
            : params.pageTab === FEATURES_TAB
            ? handleRemoveFeature
            : handleRemoveFeatureSet,
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
    handleRemoveFeature,
    handleRemoveFeatureSet,
    handleRemoveFeatureVector,
    handleRequestOnExpand,
    isStagingMode,
    params.pageTab,
    onDeleteFeatureVector,
    selectedItem,
    tableStore.isTablePanelOpen
  ])

  useEffect(() => {
    navigateToDetailsPane(
      featureStore.featureSets,
      featureStore.features.allData,
      featureStore.entities.allData,
      featureStore.featureVectors,
      navigate,
      params,
      setSelectedItem
    )
  }, [
    featureStore.featureSets,
    featureStore.featureVectors,
    featureStore.features.allData,
    featureStore.entities.allData,
    navigate,
    params
  ])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(FEATURE_STORE_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, params, pageData.details.menu])

  useEffect(() => {
    checkTabIsValid(navigate, params, selectedItem)

    setPageData(state => {
      if (params.pageTab === FEATURE_SETS_TAB) {
        return {
          ...state,
          details: {
            ...state.details,
            menu: [...generateFeatureSetsDetailsMenu(selectedItem)],
            type: FEATURE_SETS_TAB
          }
        }
      } else if (params.pageTab === FEATURE_VECTORS_TAB) {
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
  }, [navigate, selectedItem.item, selectedItem.entities, params, selectedItem])

  useEffect(() => setContent([]), [filtersStore.tag])

  useEffect(() => {
    isPageTabValid(
      params.pageTab,
      tabs.map(tab => tab.id),
      navigate,
      location
    )
  }, [navigate, location, params.pageTab])

  useEffect(() => {
    if (openPanelByDefault) {
      switch (params.pageTab) {
        case FEATURE_SETS_TAB:
          return setFeatureSetsPanelIsOpen(true)
        case FEATURE_VECTORS_TAB:
          return setCreateVectorPopUpIsOpen(true)
        default:
          return
      }
    }
  }, [openPanelByDefault, params.pageTab])

  const applyDetailsChanges = changes => {
    return handleApplyDetailsChanges(
      changes,
      fetchData,
      params,
      selectedItem,
      setNotification,
      updateFeatureStoreData,
      filtersStore
    )
  }

  const handleActionsMenuClick = () => {
    switch (params.pageTab) {
      case FEATURE_SETS_TAB:
        return setFeatureSetsPanelIsOpen(true)
      case FEATURE_VECTORS_TAB:
        return setCreateVectorPopUpIsOpen(true)
      default:
        return null
    }
  }

  const createFeatureSetSuccess = tag => {
    const currentTag = filtersStore.tag === TAG_FILTER_ALL_ITEMS ? TAG_FILTER_ALL_ITEMS : tag

    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()
    setFilters({
      name: '',
      labels: '',
      tag: currentTag
    })

    return handleRefresh({
      project: params.projectName,
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
      {(featureStore.loading || featureStore.entities.loading || featureStore.features.loading) && (
        <Loader />
      )}
      <Content
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={cancelRequest}
        content={content}
        handleCancel={() => setSelectedItem({})}
        loading={
          featureStore.loading || featureStore.entities.loading || featureStore.features.loading
        }
        handleActionsMenuClick={handleActionsMenuClick}
        pageData={pageData}
        refresh={handleRefresh}
        selectedItem={selectedItem.item}
        getIdentifier={getIdentifierMethod(params.pageTab)}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactKind={params.pageTab.slice(0, -1)}
          refresh={handleRefresh}
          setIsPopupOpen={setIsPopupDialogOpen}
          title={pageData.actionsMenuHeader}
        />
      )}
      {featureSetsPanelIsOpen && (
        <FeatureSetsPanel
          closePanel={closePanel}
          createFeatureSetSuccess={createFeatureSetSuccess}
          project={params.projectName}
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

export default connect(
  ({ filtersStore, featureStore }) => ({
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
