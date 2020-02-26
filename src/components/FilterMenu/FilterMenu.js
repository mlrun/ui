import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'

import './filterMenu.scss'

const FilterMenu = ({ filters, match, onChange }) => {
  const [items] = useState(['Latest'])

  const handleChangeArtifactFilterTree = item => {
    onChange({ tag: item.toLowerCase(), project: match.params.projectName })
  }

  return (
    <div className="content__action_bar__filters">
      {filters.map((filter, index) =>
        filter === 'tree' ? (
          <ArtifactFilterTree
            key={filter}
            value="Latest"
            label="Tree :"
            items={items}
            onChange={handleChangeArtifactFilterTree}
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
