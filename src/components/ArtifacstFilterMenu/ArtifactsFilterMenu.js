import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import Select from '../../common/Select/Select'
import refresh from '../../images/refresh.png'
import './artifactsfiltermenu.scss'

const ArtifactsFilerMenu = ({ refreshArtifacts, onChangeFilter }) => {
  const [filter, setFilter] = useState({
    period: new Date().setDate(new Date().getDate() - 7),
    tree: 'latest'
  })

  const changeFilter = useCallback(
    _filter => {
      setFilter(prevFilter => ({ ...prevFilter, ..._filter }))
      onChangeFilter({ ...filter, ..._filter })
    },
    [filter, onChangeFilter]
  )

  const treeFilter = useCallback(
    _filter => {
      setFilter(prevFilter => ({ ...prevFilter, ..._filter }))
      onChangeFilter()
      // onChangeFilter({ ...filter, ..._filter })
    },
    [onChangeFilter]
  )

  return (
    <div className="artifacts_filter_container">
      <Select
        label="Period:"
        value={filter.period}
        onChange={value => {
          changeFilter(value)
        }}
      />
      <Select
        label="Tree:"
        value={filter.tree}
        onChange={value => {
          treeFilter(value)
        }}
      />
      <div className="artifacts_filter_refresh">
        <button onClick={refreshArtifacts}>
          <img src={refresh} alt="refresh" />
        </button>
      </div>
    </div>
  )
}

ArtifactsFilerMenu.propTypes = {
  refreshArtifacts: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired
}

export default ArtifactsFilerMenu
