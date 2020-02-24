import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Select from '../../common/Select/Select'

import './filterMenu.scss'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'

const FilterMenu = ({ filters }) => {
  const [items] = useState(['Latest'])

  const handleChnage = item => {
    console.log(item)
  }

  return (
    <div className="content__action_bar__filters">
      {filters.map((filter, index) =>
        filter === 'tree' ? (
          <ArtifactFilterTree
            key={filter}
            value="Latest"
            items={items}
            onChange={handleChnage}
          />
        ) : (
          <Select filter={filter} key={filter} />
        )
      )}
    </div>
  )
}

FilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default FilterMenu
