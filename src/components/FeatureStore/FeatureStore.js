import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
  DETAILS_STATISTICS_TAB
} from '../../constants'

const FeatureStore = ({
  artifactsStore,
  fetchDataSets,
  fetchFeatureSets,
  fetchFeatures,
  history,
  match,
  removeDataSets,
  removeFeatureSets,
  setArtifactFilter
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
        result = await fetchFeatureSets(item)

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
      }
    },
    [fetchDataSets, fetchFeatureSets, fetchFeatures, match.params.pageTab]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setContent([])
      setGroupFilter('')
      removeDataSets()
      removeFeatureSets()
      setSelectedItem({})
    }
  }, [fetchData, match.params.projectName, removeDataSets, removeFeatureSets])

  useEffect(() => {
    if (match.params.pageTab === FEATURE_SETS_TAB) {
      setGroupFilter('name')
    } else if (groupFilter.length > 0) {
      setGroupFilter('')
    }
  }, [match.params.pageTab, groupFilter.length])

  useEffect(() => {
    setPageData(generatePageData(match.params.pageTab))
  }, [match.params.pageTab])

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
    }

    if (match.params.name && artifacts.length !== 0) {
      const [selectedArtifact] = artifacts.filter(artifact => {
        const searchKey = artifact.name ? 'name' : 'key'

        if (match.params.pageTab === FEATURE_SETS_TAB) {
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
    artifactsStore.features
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
        newDetailsMenu.push('metadata')
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

  const handleDataSetTreeFilterChange = useCallback(
    item => {
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
      match.params.projectName,
      setArtifactFilter
    ]
  )

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={content}
        groupFilter={groupFilter}
        handleArtifactFilterTree={handleDataSetTreeFilterChange}
        handleCancel={() => setSelectedItem({})}
        handleSelectItem={item => setSelectedItem({ item })}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
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
    </>
  )
}

FeatureStore.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction
})(FeatureStore)
