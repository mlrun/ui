import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ArtifactsView from '../ArtifactsView/ArtifactsView'
import artifactsAction from '../../actions/artifacts'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'

import './artifacts.scss'

const Artifacts = ({ match, artifactsStore, fetchArtifacts, setArtifacts }) => {
  const [loading, setLoading] = useState(false)
  const [artifacts, _setArtifacts] = useState(artifactsStore.artifacts)
  const [filter, setFilter] = useState({
    period: null
  })
  const fetchData = useCallback(
    item => {
      if (item || artifactsStore.artifacts.length === 0) {
        setLoading(true)
        fetchArtifacts().then(data => {
          if (filter.period) {
            data = data.filter(item => {
              return new Date(item.updated * 1000).getTime() < filter.period
            })
          }
          _setArtifacts(data)
          setLoading(false)
        })
      }
    },
    [fetchArtifacts, artifactsStore.artifacts, filter.period]
  )

  const changePeriod = useCallback(
    date => {
      if (date) {
        setFilter({ period: date })
        let filterArtifacts = artifactsStore.artifacts.filter(item => {
          return new Date(item.updated * 1000).getTime() < date
        })
        _setArtifacts(filterArtifacts)
      }
    },
    [artifactsStore.artifacts]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    changePeriod()
  }, [changePeriod])

  const refresh = useCallback(() => {
    setArtifacts({ artifacts: [] })
  }, [setArtifacts])

  return (
    <>
      <div className="artifacts_header">
        <Breadcrumbs match={match} />
      </div>
      <div className="artifacts_container">
        <ArtifactsView
          artifacts={artifacts}
          loading={loading}
          refresh={refresh}
          filter={filter}
          changePeriod={changePeriod}
        ></ArtifactsView>
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
