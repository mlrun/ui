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
  ARTIFACTS_DATASETS_PAGE,
  ARTIFACTS_FEATURE_SETS_PAGE,
  DETAILS_ANALYSIS_TAB,
  DETAILS_METADATA_TAB
} from '../../constants'

const FeatureStore = ({
  artifactsStore,
  fetchDataSets,
  fetchFeatureSets,
  history,
  match,
  removeDataSets,
  removeFeatureSets,
  setArtifactFilter
}) => {
  const [content, setContent] = useState([])
  const [selectedItem, setSelectedItem] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    detailsMenu: [],
    filters: [],
    infoHeaders: [],
    page: '',
    pageKind: '',
    registerArtifactDialogTitle: '',
    tabs: []
  })

  const fetchData = useCallback(
    async item => {
      let result
      if (match.params.pageTab === ARTIFACTS_DATASETS_PAGE) {
        result = await fetchDataSets(item)

        if (result) {
          setContent(generateArtifacts(result))

          return result
        }
      } else if (match.params.pageTab === ARTIFACTS_FEATURE_SETS_PAGE) {
        result = await fetchFeatureSets(item)

        if (result) {
          setContent(result)

          return result
        }
      }
    },
    [fetchDataSets, fetchFeatureSets, match.params.pageTab]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setContent([])
      removeDataSets()
      removeFeatureSets()
      setSelectedItem({})
    }
  }, [fetchData, match.params.projectName, removeDataSets, removeFeatureSets])

  useEffect(() => {
    setPageData(
      generatePageData(match.params.pageTab === ARTIFACTS_FEATURE_SETS_PAGE)
    )
  }, [match.params.pageTab])

  useEffect(() => {
    generatePageData(match.params.pageTab === ARTIFACTS_FEATURE_SETS_PAGE)
  }, [match.params.pageTab])

  useEffect(() => {
    if (match.params.name) {
      const { name } = match.params
      let artifacts = []

      if (
        match.params.pageTab === ARTIFACTS_FEATURE_SETS_PAGE &&
        artifactsStore.featureSets.length > 0
      ) {
        artifacts = artifactsStore.featureSets
      } else if (
        match.params.pageTab === ARTIFACTS_DATASETS_PAGE &&
        artifactsStore.dataSets.length > 0
      ) {
        artifacts = artifactsStore.dataSets
      }

      const [searchItem] = artifacts.filter(item => {
        const searchKey = item.name ? 'name' : 'key'
        return item[searchKey] === name
      })

      if (!searchItem) {
        history.push(
          `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}`
        )
      } else {
        if (match.params.pageTab === ARTIFACTS_DATASETS_PAGE) {
          const [dataSet] = searchItem.data.filter(item => {
            if (searchItem.link_iteration) {
              const { link_iteration } = searchItem.link_iteration

              return link_iteration === item.iter
            }

            return true
          })

          return setSelectedItem({ item: dataSet })
        }

        setSelectedItem({ item: searchItem })
      }
    } else {
      setSelectedItem({})
    }
  }, [
    match.params,
    artifactsStore.artifacts,
    history,
    artifactsStore.dataSets,
    artifactsStore.featureSets
  ])

  useEffect(() => {
    if (
      (match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
        !selectedItem.item?.schema &&
        !selectedItem.item?.entities) ||
      (match.params.tab === DETAILS_ANALYSIS_TAB &&
        !selectedItem.item?.extra_data)
    ) {
      history.push(
        `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}/${match.params.name}/info`
      )
    }

    setPageData(state => {
      const newDetailsMenu = [...detailsMenu]

      if (selectedItem.item?.schema || selectedItem.item?.entities) {
        newDetailsMenu.push('metadata')
      }

      if (selectedItem.item?.extra_data) {
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
    match.params.pageTab
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
