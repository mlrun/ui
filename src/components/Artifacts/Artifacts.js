import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import artifactsAction from '../../actions/artifacts'
import { connect } from 'react-redux'

import './artifacts.scss'
import Content from '../../layout/Content/Content'
import { formatDatetime, parseKeyValues, truncateUid } from '../../utils'
import YAML from 'yamljs'

const Artifacts = ({
  match,
  artifactsStore,
  fetchArtifacts,
  selectArtifact
}) => {
  const [loading, setLoading] = useState(false)
  const [artifacts, _setArtifacts] = useState(artifactsStore.artifacts)
  const [convertedYaml, setConvertedYaml] = useState()

  const fetchData = useCallback(
    item => {
      if (item || artifactsStore.artifacts.length === 0) {
        setLoading(true)
        fetchArtifacts().then(data => {
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
            return item
          })
          _setArtifacts(artifacts)
          setLoading(false)
        })
      }
    },
    [fetchArtifacts, artifactsStore.artifacts]
  )

  const tableHeaders = [
    {
      header: 'Name',
      size: 'artifacts_medium'
    },
    {
      header: 'Path',
      size: 'artifacts_big'
    },
    {
      header: 'Type',
      size: 'artifacts_small'
    },
    {
      header: 'Labels',
      size: 'artifacts_big'
    },
    {
      header: 'Producer',
      size: 'artifacts_small'
    },
    {
      header: 'Hash',
      size: 'artifacts_small'
    },
    {
      header: 'Updated at',
      size: 'artifacts_small'
    },
    {
      header: '',
      size: 'artifacts_small'
    }
  ]

  const tableContent = artifacts.map(artifact => ({
    key: {
      value: artifact.key,
      size: 'artifacts_medium'
    },
    target_path: {
      value: artifact.target_path,
      size: 'artifacts_big'
    },
    king: {
      value: artifact.king,
      size: 'artifacts_small'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      size: 'artifacts_big',
      type: 'labels'
    },
    producer: {
      value: artifact.producer,
      size: 'artifacts_small',
      type: 'producer'
    },
    hash: {
      value: truncateUid(artifact.hash),
      size: 'artifacts_small'
    },
    updated: {
      value: formatDatetime(new Date(artifact.updated)),
      size: 'artifacts_small'
    },
    buttons: {
      value: '',
      size: 'artifacts_small'
    }
  }))

  const detailsMenu = ['info', 'inputs', 'artifacts', 'results', 'logs']

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (artifactsStore.selectArtifact) {
      if (
        match.params.name === undefined &&
        Object.keys(artifactsStore.selectArtifact).length !== 0
      ) {
        selectArtifact({})
      }

      if (
        match.params.name !== undefined &&
        Object.keys(artifactsStore.selectArtifact).length === 0
      ) {
        const { name } = match.params
        if (artifactsStore.artifacts.length !== 0) {
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
      }
    }
  }, [
    artifactsStore.artifacts,
    artifactsStore.selectArtifact,
    match.params,
    selectArtifact
  ])

  const convertToYaml = item => {
    document.getElementById('yaml_modal').style.display = 'flex'
    setConvertedYaml(YAML.stringify(item))
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
      tableHeaders={tableHeaders}
      filters={['period', 'tree']}
      detailsMenu={detailsMenu}
    />
  )
}

Artifacts.propTypes = {
  match: PropTypes.shape({}).isRequired,
  artifactsStore: PropTypes.shape({}).isRequired,
  fetchArtifacts: PropTypes.func.isRequired
}

export default connect(
  artifactsStore => artifactsStore,
  artifactsAction
)(Artifacts)
