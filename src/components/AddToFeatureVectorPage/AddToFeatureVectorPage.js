import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import AddToFeatureVectorPageHeader from '../../elements/AddToFeatureVectorPageHeader/AddToFeatureVectorPageHeader'

import featureStoreActions from '../../actions/featureStore'
import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import {
  generatePageData,
  pageDataInitialState
} from './addToFeatureVectorPage.util'
import {
  getFeatureIdentifier,
  getIdentifierMethod
} from '../../utils/getUniqueIdentifier'
import {
  FEATURES_TAB,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  STATUS_CODE_FORBIDDEN,
  TAG_FILTER_LATEST
} from '../../constants'
import { parseFeatures } from '../../utils/parseFeatures'
import tableActions from '../../actions/table'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

const AddToFeatureVectorPage = ({
  createNewFeatureVector,
  featureStore,
  fetchFeature,
  fetchFeatures,
  filtersStore,
  fetchFeatureSetsTags,
  getFilterTagOptions,
  history,
  match,
  removeDataSet,
  removeFeature,
  removeFeatures,
  setFilters,
  setNotification,
  setTablePanelOpen,
  tableStore
}) => {
  const [content, setContent] = useState([])
  const [pageData, setPageData] = useState(pageDataInitialState)
  const addToFeatureVectorPageRef = useRef(null)

  const cancelRequest = message => {
    addToFeatureVectorPageRef.current?.cancel &&
      addToFeatureVectorPageRef.current.cancel(message)
  }

  const fetchData = useCallback(
    async filters => {
      const config = {
        cancelToken: new axios.CancelToken(cancel => {
          addToFeatureVectorPageRef.current.cancel = cancel
        })
      }

      fetchFeatures(filters.project, filters, config).then(result => {
        if (result) {
          setContent(parseFeatures(result))
        }

        return result
      })
    },
    [fetchFeatures]
  )

  const handleRemoveFeature = useCallback(
    feature => {
      const newStoreSelectedRowData = {
        ...featureStore.features.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...pageData.selectedRowData }

      delete newStoreSelectedRowData[feature.key.identifier]
      delete newPageDataSelectedRowData[feature.key.identifier]

      removeFeature(newStoreSelectedRowData)
      setPageData(state => ({
        ...state,
        selectedRowData: newPageDataSelectedRowData
      }))
    },
    [
      featureStore.features.selectedRowData.content,
      pageData.selectedRowData,
      removeFeature
    ]
  )

  const handleRequestOnExpand = useCallback(
    async feature => {
      const featureIdentifier = getFeatureIdentifier(feature)

      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [featureIdentifier]: {
            loading: true
          }
        }
      }))

      fetchFeature(
        feature.metadata.project,
        feature.name,
        feature.metadata.name
      )
        .then(result => {
          if (result?.length > 0) {
            setPageData(state => ({
              ...state,
              selectedRowData: {
                ...state.selectedRowData,
                [featureIdentifier]: {
                  content: [...parseFeatures(result)],
                  error: null,
                  loading: false
                }
              }
            }))
          }
        })
        .catch(error => {
          setPageData(state => ({
            ...state,
            selectedRowData: {
              ...state.selectedRowData,
              [featureIdentifier]: {
                ...state.selectedRowData[featureIdentifier],
                error,
                loading: false
              }
            }
          }))
        })
    },
    [fetchFeature]
  )

  const navigateToFeatureVectorsScreen = useCallback(() => {
    history.push(
      `/projects/${match.params.projectName}/feature-store/feature-vectors`
    )
  }, [history, match.params.projectName])

  const handleCancelCreateFeatureVector = useCallback(() => {
    setTablePanelOpen(false)
    navigateToFeatureVectorsScreen()
  }, [navigateToFeatureVectorsScreen, setTablePanelOpen])

  const handleCreateFeatureVector = useCallback(
    featureVector => {
      createNewFeatureVector(featureVector)
        .then(response => {
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Feature vector created successfully'
          })
          setTablePanelOpen(false)
          navigateToFeatureVectorsScreen()
        })
        .catch(error => {
          setNotification({
            status: error.response.status || 400,
            id: Math.random(),
            message:
              error.response.status === STATUS_CODE_FORBIDDEN
                ? 'You are not permitted to create new feature vector.'
                : 'Feature vector creation failed.',
            retry: handleCreateFeatureVector
          })

          if (error.response.status === STATUS_CODE_FORBIDDEN) {
            setTablePanelOpen(false)
            navigateToFeatureVectorsScreen()
          }
        })
    },
    [
      createNewFeatureVector,
      navigateToFeatureVectorsScreen,
      setNotification,
      setTablePanelOpen
    ]
  )

  useEffect(() => {
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.iter, removeDataSet])

  useEffect(() => {
    fetchData({
      tag: TAG_FILTER_LATEST,
      project: match.params.projectName
    })

    return () => {
      setContent([])
      removeFeatures()
      setPageData(pageDataInitialState)
      cancelRequest('cancel')
    }
  }, [fetchData, match.params.projectName, removeFeatures])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_LATEST) {
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
          tableStore.isTablePanelOpen,
          handleRemoveFeature,
          handleRequestOnExpand,
          handleCreateFeatureVector,
          handleCancelCreateFeatureVector
        )
      }
    })
  }, [
    handleCancelCreateFeatureVector,
    handleCreateFeatureVector,
    handleRemoveFeature,
    handleRequestOnExpand,
    tableStore.isTablePanelOpen
  ])

  useEffect(() => setContent([]), [filtersStore.tag])

  useEffect(() => {
    if (filtersStore.tagOptions.length === 0) {
      getFilterTagOptions(fetchFeatureSetsTags, match.params.projectName)
    }
  }, [
    fetchFeatureSetsTags,
    filtersStore.tagOptions.length,
    getFilterTagOptions,
    match.params.projectName
  ])

  useEffect(() => {
    if (isEveryObjectValueEmpty(tableStore.features.featureVector)) {
      navigateToFeatureVectorsScreen()
      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Please, create a feature vector first'
      })
    } else {
      setTablePanelOpen(true)
    }
  }, [
    navigateToFeatureVectorsScreen,
    setNotification,
    setTablePanelOpen,
    tableStore.features.featureVector
  ])

  return (
    <div
      ref={addToFeatureVectorPageRef}
      className="add-to-feature-vector content-wrapper"
    >
      {(featureStore.loading || featureStore.features.loading) && <Loader />}
      <Content
        content={content}
        header={<AddToFeatureVectorPageHeader match={match} />}
        loading={featureStore.loading || featureStore.features.loading}
        match={match}
        pageData={pageData}
        refresh={fetchData}
        getIdentifier={getIdentifierMethod(FEATURES_TAB)}
      />
    </div>
  )
}

AddToFeatureVectorPage.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ tableStore, filtersStore, featureStore }) => ({
    tableStore,
    filtersStore,
    featureStore
  }),
  {
    ...featureStoreActions,
    ...notificationActions,
    ...filtersActions,
    ...tableActions,
    ...notificationActions
  }
)(AddToFeatureVectorPage)
