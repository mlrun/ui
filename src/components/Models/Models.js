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
} from './models.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'

const Models = ({
  artifactsStore,
  fetchModels,
  history,
  match,
  setArtifactFilter
}) => {
  const [models, setModels] = useState([])
  const [selectedDataSet, setSelectedDataSet] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData] = useState({
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
      fetchModels(project).then(result => {
        let data = []

        if (result) {
          data = generateArtifacts(result)

          setModels(data)
        }

        return data
      })
    },
    [fetchModels]
  )

  useEffect(() => {
    if (models.length === 0) {
      fetchData(match.params.projectName)
    }
  }, [models.length, fetchData, match.params.projectName])

  useEffect(() => {
    if (match.params.name && artifactsStore.models.length !== 0) {
      const { name } = match.params

      const [searchItem] = artifactsStore.models.filter(
        item => item.key === name
      )

      if (!searchItem) {
        history.push(`/projects/${match.params.projectName}/models`)
      } else {
        const [model] = searchItem.data.filter(item => {
          if (searchItem.link_iteration) {
            const { link_iteration } = searchItem.link_iteration

            return link_iteration === item.iter
          }

          return true
        })

        setSelectedDataSet({ item: model })
      }
    }
  }, [match.params, artifactsStore.artifacts, history, artifactsStore.models])

  const handleModelTreeFilterChange = useCallback(
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
        content={models}
        handleArtifactFilterTree={handleModelTreeFilterChange}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectDataSet}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedDataSet.item}
        yamlContent={artifactsStore.models}
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
})(Models)
