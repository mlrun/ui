import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ArtifactsView from '../ArtifactsView/ArtifactsView'
import artifactsAction from '../../actions/artifacts'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import { connect } from 'react-redux'

import './artifacts.scss'

const Artifacts = ({ match, artifactsStore, fetchArtifacts }) => {
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
              return new Date(item.updated).getTime() > filter.period
            })
          }
          _setArtifacts(data)
          setLoading(false)
        })
      }
    },
    [fetchArtifacts, artifactsStore.artifacts, filter.period]
  )

  const onChangeFilter = useCallback(
    _filter => {
      // _filter looks like {period: 123}
      setFilter(prevFilter => ({ ...prevFilter, ..._filter }))
      if (_filter) {
        let filterArtifacts = artifactsStore.artifacts.reduce((prev, curr) => {
          let tree = curr.tree
            .reduce((_prev, _curr) => {
              let filter = _curr.filter(
                item => new Date(item.updated).getTime() > _filter.period
              )
              return [..._prev, [...filter]]
            }, [])
            .filter(item => item.length !== 0)

          if (tree.length !== 0) {
            return [...prev, { key: curr.key, tree: [...tree] }]
          } else {
            return [...prev]
          }
        }, [])
        _setArtifacts(filterArtifacts)
      }
    },
    [artifactsStore.artifacts]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    onChangeFilter()
  }, [onChangeFilter])

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
          onChangeFilter={onChangeFilter}
        />
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
