import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'
import jobsActions from '../../actions/jobs'

import refreshIcon from '../../images/refresh.png'

import './filterMenu.scss'

const FilterMenu = ({
  filters,
  match,
  onChange,
  page,
  stateFilter,
  setStateFilter
}) => {
  const [itemsFilterTree] = useState(['Latest'])
  const [valueFilterTree, setValueFilterTree] = useState('')

  const handleChangeArtifactFilterTree = item => {
    const value = item.toLowerCase()
    onChange({ tag: value, project: match.params.projectName })
    setValueFilterTree(value)
  }

  return (
    <div className="content__action_bar__filters">
      {filters.map((filter, index) =>
        filter === 'tree' ? (
          <ArtifactFilterTree
            key={filter}
            value={valueFilterTree || 'Latest'}
            label="Tree :"
            items={itemsFilterTree}
            onChange={handleChangeArtifactFilterTree}
          />
        ) : (
          <Select
            filter={filter}
            key={filter}
            value={filter === 'status' && stateFilter}
            onClick={filter === 'status' && setStateFilter}
          />
        )
      )}
      <button
        className="content__action_bar_refresh"
        onClick={() => {
          page === 'artifacts'
            ? onChange({
                tag: valueFilterTree.toLowerCase(),
                project: match.params.projectName
              })
            : onChange()
        }}
      >
        <img src={refreshIcon} alt="refresh" />
      </button>
    </div>
  )
}

FilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default connect(null, jobsActions)(FilterMenu)
