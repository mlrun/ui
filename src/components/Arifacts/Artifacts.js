import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ArtifactsView from '../ArtifactsView/ArtifactsView'
import artifactsAction from '../../actions/artifacts'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'

import './artifacts.scss'

const Artifacts = ({ match, artifactsStore, fetchArtifacts }) => {
  const [loading, setLoading] = useState(false)
  const [artifacts, setArtifacts] = useState(artifactsStore.artifacts)
  const fetchData = useCallback(
    item => {
      if (item || artifactsStore.artifacts.length === 0) {
        setLoading(true)
        fetchArtifacts().then(data => {
          setArtifacts(data)
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
    if (artifactsStore.isRefresh) {
      setArtifacts(artifactsStore.artifacts)
    }
  }, [artifactsStore.artifacts, artifactsStore.isRefresh])

  return (
    <>
      <div className="artifacts-header">
        <Breadcrumbs match={match} />
      </div>
      <div className="artifacts-container">
        <ArtifactsView artifacts={artifacts} loading={loading}></ArtifactsView>
      </div>
    </>
  )
}

Artifacts.propTypes = {
  match: PropTypes.shape({}).isRequired,
  artifactsStore: PropTypes.shape({}).isRequired,
  fetchArtifacts: PropTypes.func.isRequired
}

export default React.memo(
  connect(artifactsStore => artifactsStore, artifactsAction)(Artifacts),
  (prevProps, nextProps) => prevProps.match !== nextProps.match
)
