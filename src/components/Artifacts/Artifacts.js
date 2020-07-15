import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import parseTargetPath from '../../utils/parseTargetPath'

import artifactApi from '../../api/artifacts-api'
import artifactsAction from '../../actions/artifacts'
import artifactsData from './artifactsData'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'

import './artifacts.scss'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

const Artifacts = ({
  artifactsStore,
  fetchArtifacts,
  history,
  match,
  removeArtifacts
}) => {
  const [artifacts, _setArtifacts] = useState([])
  const [selectedArtifact, setSelectedArtifact] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)

  const [pageData, setPageData] = useState({
    detailsMenu: artifactsData.detailsMenu,
    filters: artifactsData.filters,
    page: artifactsData.page,
    tableHeaders: artifactsData.tableHeaders
  })

  const fetchData = useCallback(
    item => {
      fetchArtifacts(item).then(data => {
        const artifacts = data
          .map(artifact => {
            let item = null

            if (artifact.link_iteration) {
              let { link_iteration } = artifact.link_iteration
              item = artifact.data.filter(
                item => item.iter === link_iteration
              )[0]
            } else {
              item = artifact.data[0]
            }
            if (item) {
              item.target_path = parseTargetPath(item.target_path)

              if (item.extra_data) {
                const generatedPreviewData = generateArtifactPreviewData(
                  item.extra_data,
                  item.target_path.schema
                )

                item.preview = generatedPreviewData.preview

                if (generatedPreviewData.extraDataPath) {
                  item.target_path.path = generatedPreviewData.extraDataPath
                }
              } else {
                item.preview = item.preview ?? []
              }
            }

            return item
          })
          .filter(item => item !== undefined)

        _setArtifacts(artifacts)
        return artifacts
      })
    },
    [fetchArtifacts]
  )

  useEffect(() => {
    fetchData({ tag: 'latest', project: match.params.projectName })

    return () => {
      _setArtifacts([])
      removeArtifacts()
    }
  }, [fetchData, match.params.projectName, removeArtifacts])

  useEffect(() => {
    if (
      match.params.name !== undefined &&
      artifactsStore.artifacts.length !== 0
    ) {
      const { name } = match.params

      const [searchItem] = artifactsStore.artifacts.filter(item => {
        return item.key === name
      })

      if (searchItem === undefined) {
        history.push(`/projects/${match.params.projectName}/artifacts`)
      } else {
        const [artifact] = searchItem.data.filter(item => {
          if (searchItem.link_iteration) {
            const { link_iteration } = searchItem.link_iteration
            return link_iteration === item.iter
          }
          return true
        })
        setSelectedArtifact({ item: artifact })
      }
    }
  }, [match.params, artifactsStore.artifacts, history])

  useEffect(() => {
    artifactApi.getArtifactTag(match.params.projectName)
  }, [match.params.projectName])

  const handleSelectArtifact = (item, preview) => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedArtifact({ item })
  }

  useEffect(() => {
    if (match.params.tab === 'metadata' && !selectedArtifact.item?.schema) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )
    }

    setPageData(state => {
      if (selectedArtifact.item?.schema) {
        return {
          ...state,
          detailsMenu: [...artifactsData.detailsMenu, 'metadata']
        }
      }

      return {
        ...state,
        detailsMenu: artifactsData.detailsMenu
      }
    })
  }, [
    match.params.tab,
    match.params.projectName,
    match.params.name,
    history,
    selectedArtifact.item
  ])

  const handleCancel = () => {
    setSelectedArtifact({})
  }

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={artifacts}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectArtifact}
        loading={artifactsStore.loading}
        match={match}
        pageData={pageData}
        refresh={fetchData}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        selectedItem={selectedArtifact.item}
        yamlContent={artifactsStore.artifacts}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          match={match}
          refresh={fetchData}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
        />
      )}
    </>
  )
}

Artifacts.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  artifactsStore => artifactsStore,
  artifactsAction
)(Artifacts)
