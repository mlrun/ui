import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import yaml from 'js-yaml'

import Content from '../../layout/Content/Content'

import artifactsAction from '../../actions/artifacts'
import artifactsData from './artifactsData'

import './artifacts.scss'
import createArtifactsContent from '../../utils/createArtifactsContent'

const Artifacts = ({
  match,
  artifactsStore,
  fetchArtifacts,
  selectArtifact
}) => {
  const [loading, setLoading] = useState(false)
  const [artifacts, _setArtifacts] = useState(artifactsStore.artifacts)
  const [convertedYaml, setConvertedYaml] = useState()
  const [tableContent, setArtifactsContent] = useState([])

  const fetchData = useCallback(
    item => {
      if (item || artifactsStore.artifacts.length === 0) {
        setLoading(true)
        fetchArtifacts()
          .then(data => {
            const artifacts = data.map(artifact => {
              let item = null
              if (artifact.link_iteration) {
                let { link_iteration } = artifact.link_iteration
                item = artifact.data.filter(
                  item => item.iter === link_iteration
                )[0]
              } else {
                item = artifact.data[0]
              }
              const index = item.target_path.indexOf('://')
              const target_path = {
                schema: item.target_path.includes('://')
                  ? item.target_path.slice(0, index)
                  : '',
                path: item.target_path.includes('://')
                  ? item.target_path.slice(index + '://'.length)
                  : item.target_path
              }
              item.target_path = target_path
              return item
            })
            _setArtifacts(artifacts)
            setLoading(false)
            return artifacts
          })
          .then(artifacts => {
            const content = createArtifactsContent(artifacts)
            setArtifactsContent(content)
          })
      }
    },
    [fetchArtifacts, artifactsStore.artifacts]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    //remove the select artifact when user closes the artifact details page
    if (
      match.params.name === undefined &&
      Object.keys(artifactsStore.selectArtifact).length !== 0
    ) {
      selectArtifact({})
    }
    //find the current artifact when user selects the artifact and updates site or an artifact name and tab exists in the URL
    if (
      match.params.name !== undefined &&
      Object.keys(artifactsStore.selectArtifact).length === 0 &&
      artifactsStore.artifacts.length !== 0
    ) {
      const { name } = match.params
      const [searchItem] = artifactsStore.artifacts.filter(
        item => item.key === name
      )

      const [artifact] = searchItem.data.filter(item => {
        if (searchItem.link_iteration) {
          const { link_iteration } = searchItem.link_iteration
          return link_iteration === item.iter
        }
        return true
      })
      selectArtifact(artifact)
    }
  }, [
    artifactsStore.artifacts,
    artifactsStore.selectArtifact,
    match.params,
    selectArtifact
  ])

  const convertToYaml = item => {
    document.getElementById('yaml_modal').style.display = 'flex'
    setConvertedYaml(yaml.safeDump(item))
  }

  const handleSelectArtifact = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    selectArtifact(item)
  }

  const handleCancel = () => {
    selectArtifact({})
  }

  return (
    <Content
      tableContent={tableContent}
      content={artifacts}
      selectedItem={artifactsStore.selectArtifact}
      match={match}
      refresh={fetchData}
      handleSelectItem={handleSelectArtifact}
      handleCancel={handleCancel}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      loading={loading}
      tableHeaders={artifactsData.tableHeaders}
      filters={artifactsData.filters}
      detailsMenu={artifactsData.detailsMenu}
      page={'artifacts'}
    />
  )
}

Artifacts.propTypes = {
  match: PropTypes.shape({}).isRequired,
  artifactsStore: PropTypes.shape({}).isRequired,
  fetchArtifacts: PropTypes.func.isRequired,
  selectArtifact: PropTypes.func.isRequired
}

export default connect(
  artifactsStore => artifactsStore,
  artifactsAction
)(Artifacts)
