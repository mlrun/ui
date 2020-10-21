import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import artifactsAction from '../../actions/artifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import {
  detailsMenu,
  filters,
  page,
  pageKind,
  registerArtifactDialogTitle,
  tableHeaders,
  infoHeaders
} from './dataSets.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import { DETAILS_ANALYSIS_TAB, DETAILS_METADATA_TAB } from '../../constants'

const DataSets = ({
  artifactsStore,
  fetchDataSets,
  history,
  match,
  setArtifactFilter
}) => {
  const [dataSets, setDataSets] = useState([])
  const [selectedDataSet, setSelectedDataSet] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    detailsMenu,
    filters,
    page,
    pageKind,
    registerArtifactDialogTitle,
    tableHeaders,
    infoHeaders
  })

  const fetchData = useCallback(
    project => {
      fetchDataSets(project).then(result => {
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
    if (dataSets.length === 0) {
      fetchData(match.params.projectName)
    }
  }, [dataSets.length, fetchData, match.params.projectName])

  useEffect(() => {
    if (match.params.name && artifactsStore.dataSets.length !== 0) {
      const { name } = match.params

      const [searchItem] = artifactsStore.dataSets.filter(
        item => item.key === name
      )

      if (!searchItem) {
        history.push(`/projects/${match.params.projectName}/datasets`)
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
    }
  }, [match.params, artifactsStore.artifacts, history, artifactsStore.dataSets])

  useEffect(() => {
    if (
      (match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
        !selectedDataSet.item?.schema) ||
      (match.params.tab === DETAILS_ANALYSIS_TAB &&
        ((selectedDataSet.item?.kind === 'dataset' &&
          !selectedDataSet.item?.extra_data) ||
          selectedDataSet.item?.kind !== 'dataset'))
    ) {
      history.push(
        `/projects/${match.params.projectName}/datasets/${match.params.name}/info`
      )
    }

    setPageData(state => {
      const newDetailsMenu = [...detailsMenu]

      if (selectedDataSet.item?.schema) {
        newDetailsMenu.push('metadata')
      }

      if (
        selectedDataSet.item?.kind === 'dataset' &&
        selectedDataSet.item?.extra_data
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
    selectedDataSet.item
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

  const handleCancel = () => {
    setSelectedDataSet({})
  }

  const handleSelectDataSet = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }

    setSelectedDataSet({ item })
  }

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={dataSets}
        handleArtifactFilterTree={handleDataSetTreeFilterChange}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectDataSet}
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

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction
})(DataSets)
