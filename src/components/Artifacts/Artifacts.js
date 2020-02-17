import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import artifactsAction from '../../actions/artifacts'
import { connect } from 'react-redux'

import './artifacts.scss'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ArtifactsView from '../ArtifactsView/ArtifactsView'

const Artifacts = ({
  match,
  artifactsStore,
  fetchArtifacts,
  selectArtifact
}) => {
  const [loading, setLoading] = useState(false)
  const [artifacts, _setArtifacts] = useState(artifactsStore.artifacts)

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

  return (
    <>
      <div className="artifacts_header">
        <Breadcrumbs match={match} />
      </div>
      <div className="artifacts_container">
        <ArtifactsView
          match={match}
          artifacts={artifacts}
          loading={loading}
          refresh={fetchData}
          selectArtifact={artifactsStore.selectArtifact}
        />
      </div>
    </>

    // {/*<Content*/}
    // {/*  tableContent={[]}*/}
    // {/*  artifacts={artifacts}*/}
    // {/*  selectedItem={artifactsStore.selectArtifact}*/}
    // {/*  match={match}*/}
    // {/*  refresh={fetchData}*/}
    // {/*  // handleSelectItem={handleSelectItem}*/}
    // {/*  // handleCancel={handleCancel}*/}
    // {/*  loading={loading}*/}
    // {/*  tableHeaders={tableHeaders}*/}
    // {/*  filters={['period', 'tree']}*/}
    // {/*/>*/}
    // {/*<>*/}
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
