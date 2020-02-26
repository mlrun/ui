import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'

import './filterMenu.scss'

import jobsActions from '../../actions/jobs'

const FilterMenu = ({ filters, stateFilter, setStateFilter }) => {
  const [items] = useState(['Latest'])

  const handleChange = item => {
    // console.log(item)
  }

  return (
    <div className="content__action_bar__filters">
      {filters.map((filter, index) =>
        filter === 'tree' ? (
          <ArtifactFilterTree
            key={filter}
            value="Latest"
            items={items}
            onChange={handleChange}
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
    </div>
  )
}

FilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default connect(null, jobsActions)(FilterMenu)
