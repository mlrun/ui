import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactsAction from '../../actions/artifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import {
  detailsMenu,
  filters,
  infoHeaders,
  page,
  pageKind,
  registerArtifactDialogTitle,
  tableHeaders,
  tabs
} from './feaureStore.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import {
  ARTIFACTS_DATASETS_PAGE,
  ARTIFACTS_FEATURE_STORE,
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
  setArtifactFilter
}) => {
  const [content, setContent] = useState([])
  const [selectedItem, setSelectedItem] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    detailsMenu,
    filters,
    infoHeaders,
    page,
    pageKind,
    registerArtifactDialogTitle,
    tableHeaders,
    tabs
  })

  const fetchData = useCallback(
    item => {
      fetchDataSets(item).then(result => {
        let data = []

        if (result) {
          data = generateArtifacts(result)

          setContent(data)
        }

        return data
      })
    },
    [fetchDataSets, fetchFeatureSets, match.params.pageTab]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setContent([])
      removeDataSets()
      setSelectedItem({})
    }
  }, [fetchData, match.params.projectName, removeDataSets])

  useEffect(() => {
    if (match.params.name && artifactsStore.dataSets.length !== 0) {
      const { name } = match.params

      const [searchItem] = artifactsStore.dataSets.filter(
        item => item.key === name
      )

      if (!searchItem) {
        history.push(
          `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}`
        )
      } else {
        const [dataSet] = searchItem.data.filter(item => {
          if (searchItem.link_iteration) {
            const { link_iteration } = searchItem.link_iteration

            return link_iteration === item.iter
          }

          return true
        })

        setSelectedItem({ item: dataSet })
      }
    } else {
      setSelectedItem({})
    }
  }, [match.params, artifactsStore.artifacts, history, artifactsStore.dataSets])

  useEffect(() => {
    if (
      (match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
        !selectedItem.item?.schema) ||
      (match.params.tab === DETAILS_ANALYSIS_TAB &&
        !selectedItem.item?.extra_data)
    ) {
      history.push(
        `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}/${match.params.name}/info`
      )
    }

    setPageData(state => {
      const newDetailsMenu = [...detailsMenu]

      if (selectedItem.item?.schema) {
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
        yamlContent={artifactsStore.dataSets}
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
