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
  page,
  registerArtifactDialogTitle,
  tableHeaders,
  infoHeaders
} from './models.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import { filterArtifacts } from '../../utils/filterArtifacts'

const Models = ({
  artifactsStore,
  fetchModels,
  history,
  match,
  removeModels,
  setArtifactFilter
}) => {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [yamlContent, setYamlContent] = useState([])
  const [pageData] = useState({
    detailsMenu,
    filters,
    page,
    registerArtifactDialogTitle,
    tableHeaders,
    infoHeaders
  })

  const fetchData = useCallback(
    item => {
      fetchModels(item).then(result => {
        let data = []

        if (result) {
          const filteredModels = filterArtifacts(result)
          data = generateArtifacts(filteredModels)

          setModels(data)
          setYamlContent(result)
        }

        return data
      })
    },
    [fetchModels]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setModels([])
      removeModels()
      setSelectedModel({})
    }
  }, [fetchData, match.params.projectName, removeModels])

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

        setSelectedModel({ item: model })
      }
    } else {
      setSelectedModel({})
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

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={models}
        handleArtifactFilterTree={handleModelTreeFilterChange}
        handleCancel={() => setSelectedModel({})}
        handleSelectItem={item => setSelectedModel({ item })}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedModel.item}
        yamlContent={yamlContent}
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

Models.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction
})(Models)
