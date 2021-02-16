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
  registerArtifactDialogTitle,
  tableHeaders,
  tabs
} from './feaureStore.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import { DETAILS_ANALYSIS_TAB, DETAILS_METADATA_TAB } from '../../constants'

const FeatureStore = ({
  artifactsStore,
  fetchDataSets,
  history,
  match,
  removeDataSets,
  setArtifactFilter
}) => {
  const [dataSets, setDataSets] = useState([])
  const [selectedDataSet, setSelectedDataSet] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    detailsMenu,
    filters,
    infoHeaders,
    page,
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

          setDataSets(data)
        }

        return data
      })
    },
    [fetchDataSets]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setDataSets([])
      removeDataSets()
      setSelectedDataSet({})
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

        setSelectedDataSet({ item: dataSet })
      }
    } else {
      setSelectedDataSet({})
    }
  }, [match.params, artifactsStore.artifacts, history, artifactsStore.dataSets])

  useEffect(() => {
    if (
      (match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
        !selectedDataSet.item?.schema) ||
      (match.params.tab === DETAILS_ANALYSIS_TAB &&
        !selectedDataSet.item?.extra_data)
    ) {
      history.push(
        `/projects/${match.params.projectName}/feature-store/${match.params.pageTab}/${match.params.name}/info`
      )
    }

    setPageData(state => {
      const newDetailsMenu = [...detailsMenu]

      if (selectedDataSet.item?.schema) {
        newDetailsMenu.push('metadata')
      }

      if (selectedDataSet.item?.extra_data) {
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
    selectedDataSet.item,
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
        content={dataSets}
        handleArtifactFilterTree={handleDataSetTreeFilterChange}
        handleCancel={() => setSelectedDataSet({})}
        handleSelectItem={item => setSelectedDataSet({ item })}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedDataSet.item}
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
