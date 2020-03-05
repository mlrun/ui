import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'

import './filterMenu.scss'

const FilterMenu = ({
  filters,
  groupFilter,
  setStateFilter,
  setGroupFilter,
  stateFilter
}) => {
  const [items] = useState(['Latest'])

  const handleChange = item => {
    // console.log(item)
  }

  return (
    <div className="content__action_bar__filters">
      {filters.map(filter =>
        filter === 'tree' ? (
          <ArtifactFilterTree
            key={filter}
            value="Latest"
            label="Tree :"
            items={items}
            onChange={handleChange}
          />
        ) : (
          <Select
            filter={filter}
            key={filter}
            value={
              (filter === 'status' && stateFilter) ||
              (filter === 'group by' && groupFilter)
            }
            onClick={
              (filter === 'status' && setStateFilter) ||
              (filter === 'group by' && setGroupFilter)
            }
          />
        )
      )}
    </div>
  )
}

FilterMenu.defaultProps = {
  groupFilter: '',
  setStateFilter: () => {},
  setGroupFilter: () => {},
  stateFilter: ''
}

FilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupFilter: PropTypes.string,
  setStateFilter: PropTypes.func,
  setGroupFilter: PropTypes.func,
  stateFilter: PropTypes.string
}

export default FilterMenu
