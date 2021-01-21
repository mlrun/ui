import React, { useCallback, useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactsAction from '../../actions/artifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { detailsMenu, generatePageData } from './feaureStore.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import {
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FEATURES_TAB,
  DETAILS_ANALYSIS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_STATISTICS_TAB,
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
      let result

      if (match.params.pageTab === DATASETS_TAB) {
        result = await fetchDataSets(item)

        if (result) {
          setContent(generateArtifacts(result))

          return result
        }
      } else if (match.params.pageTab === FEATURE_SETS_TAB) {
        const config = {
          cancelToken: new axios.CancelToken(cancel => {
            featureStoreRef.current.cancel = cancel
          })
        }

        result = await fetchFeatureSets(item, config)

        if (result) {
          setContent(result)

          return result
        }
      } else if (match.params.pageTab === FEATURES_TAB) {
        result = await fetchFeatures(item)

        if (result) {
          setContent(result)

          return result
        }
      } else if (match.params.pageTab === FEATURE_VECTORS_TAB) {
        result = await fetchFeatureVectors(item)

        if (result) {
          setContent(result)

          return result
        }
      }
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

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setContent([])
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
    const { name, tag } = match.params
    let artifacts = []

    if (
      match.params.pageTab === FEATURE_SETS_TAB &&
      artifactsStore.featureSets.length > 0
    ) {
      artifacts = artifactsStore.featureSets
    } else if (
      match.params.pageTab === FEATURES_TAB &&
      artifactsStore.features.length > 0
    ) {
      artifacts = artifactsStore.features
    } else if (
      match.params.pageTab === DATASETS_TAB &&
      artifactsStore.dataSets.length > 0
    ) {
      artifacts = artifactsStore.dataSets
    } else if (
      match.params.pageTab === FEATURE_VECTORS_TAB &&
      artifactsStore.featureVectors.allData.length > 0
    ) {
      if (artifactsStore.featureVectors.selectedRowData.content[name]) {
        artifacts = artifactsStore.featureVectors.selectedRowData.content[name]
      } else {
        artifacts = artifactsStore.featureVectors.allData
      }
    }

    if (match.params.name && artifacts.length !== 0) {
      const [selectedArtifact] = artifacts.filter(artifact => {
        const searchKey = artifact.name ? 'name' : 'key'

        if (
          match.params.pageTab === FEATURE_SETS_TAB ||
          match.params.pageTab === FEATURE_VECTORS_TAB
        ) {
          return artifact[searchKey] === name && artifact.tag === tag
        } else {
          return artifact[searchKey] === name
        }
      })

      if (!selectedArtifact) {
        history.push(
          `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}`
        )
      } else {
        if (match.params.pageTab === DATASETS_TAB) {
          const [dataSet] = selectedArtifact.data.filter(item => {
            if (selectedArtifact.link_iteration) {
              const { link_iteration } = selectedArtifact.link_iteration

              return link_iteration === item.iter
            }

            return true
          })

          return setSelectedItem({ item: dataSet })
        }

        setSelectedItem({ item: selectedArtifact })
      }
    } else {
      setSelectedItem({})
    }
  }, [
    match.params,
    artifactsStore.artifacts,
    history,
    artifactsStore.dataSets,
    artifactsStore.featureSets,
    artifactsStore.features,
    artifactsStore.featureVectors
  ])

  useEffect(() => {
    if (
      (match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
        !selectedItem.item?.schema &&
        !selectedItem.item?.entities) ||
      (match.params.tab === DETAILS_ANALYSIS_TAB &&
        !selectedItem.item?.extra_data) ||
      (match.params.tab?.toUpperCase() === DETAILS_STATISTICS_TAB &&
        match.params.pageTab !== FEATURE_SETS_TAB &&
        !selectedItem.item?.entities)
    ) {
      history.push(
        `/projects/${match.params.projectName}/feature-store/${
          match.params.pageTab
        }/${match.params.name}${
          match.params.tag ? `/${match.params.tag}` : ''
        }/overview`
      )
    }

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
    selectedItem.entities
  ])

  const handleTreeFilterChange = useCallback(
    item => {
      if (match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/feature-store${
            match.params.pageTab ? `/${match.params.pageTab}` : ''
          }`
        )
      }

      handleArtifactTreeFilterChange(
        fetchData,
        artifactsStore.filter,
        item,
        match.params.projectName,
        setArtifactFilter
      )
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
    const data = {
      spec: {
        ...changes.data
      }
    }

    if (data.spec.labels) {
      const objectLabels = {}

      data.spec.labels.forEach(label => {
        const splitedLabel = label.split(':')

        objectLabels[splitedLabel[0]] = splitedLabel[1].replace(' ', '')
      })

      data.spec.labels = { ...objectLabels }
    }

    return updateFeatureSetData(
      match.params.projectName,
      match.params.name,
      selectedItem.item.tag,
      data
    )
      .then(response => {
        return fetchData({ project: match.params.projectName }).then(() => {
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Updated successfully'
          })

          return response
        })
      })
      .catch(error => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Fail to update',
          retry: applyDetailsChanges
        })
      })
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
        yamlContent={content}
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
