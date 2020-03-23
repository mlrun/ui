import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import parseTargetPath from '../../utils/parseTargetPath'

import artifactApi from '../../api/artifacts-api'
import artifactsAction from '../../actions/artifacts'
import artifactsData from './artifactsData'

import './artifacts.scss'

const Artifacts = ({ artifactsStore, fetchArtifacts, match, history }) => {
  const [artifacts, _setArtifacts] = useState([])
  const [selectedArtifact, setSelectedArtifact] = useState({})

  const fetchData = useCallback(
    item => {
      fetchArtifacts(item).then(data => {
        const artifacts = data.map(artifact => {
          let item = null

          if (artifact.link_iteration) {
            let { link_iteration } = artifact.link_iteration
            item = artifact.data.filter(item => item.iter === link_iteration)[0]
          } else {
            item = artifact.data[0]
          }

          item.target_path = parseTargetPath(item.target_path)

          return item
        })

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
    }
  }, [fetchData, match.params.projectName])

  useEffect(() => {
    if (
      match.params.name !== undefined &&
      artifactsStore.artifacts.length !== 0
    ) {
      const { name } = match.params

      const [searchItem] = artifactsStore.artifacts.filter(item => {
        return item.key === name
      })

      const [artifact] = searchItem.data.filter(item => {
        if (searchItem.link_iteration) {
          const { link_iteration } = searchItem.link_iteration
          return link_iteration === item.iter
        }
        return true
      })

      setSelectedArtifact({ isPreview: false, item: artifact })
    } else {
      setSelectedArtifact({})
    }
  }, [match.params, artifactsStore.artifacts])

  useEffect(() => {
    artifactApi.getArtifactTag(match.params.projectName).then(item => {})
  }, [match.params.projectName])

  const handleSelectArtifact = (item, preview) => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedArtifact({ isPreview: !!preview, item })
  }

  const handleCancel = () => {
    setSelectedArtifact({})
  }

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={artifacts}
        detailsMenu={artifactsData.detailsMenu}
        filters={artifactsData.filters}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectArtifact}
        isPreview={selectedArtifact.isPreview}
        loading={artifactsStore.loading}
        match={match}
        page={artifactsData.page}
        refresh={fetchData}
        selectedItem={selectedArtifact.item}
        tableHeaders={artifactsData.tableHeaders}
      />
    </>
  )
}

Artifacts.propTypes = {
  artifactsStore: PropTypes.shape({}).isRequired,
  fetchArtifacts: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  artifactsStore => artifactsStore,
  artifactsAction
)(Artifacts)
