import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from '../../common/Select/Select'
import './artifactsfiltermenu.scss'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'

const ArtifactsFilterMenu = ({ filters }) => {
  const [items] = useState(['Latest'])

<<<<<<< HEAD
  const handleChange = item => {
    // console.log(item)
=======
  const handleChnage = item => {
    console.log(item)
>>>>>>> fdefd433b03155f1aeac596ea016c94089e07a9d
  }

  return (
    <div className="content__action_bar__filters">
      {filters.map((filter, index) =>
        filter === 'tree' ? (
          <ArtifactFilterTree
            key={filter}
            value="Latest"
            items={items}
<<<<<<< HEAD
            onChange={handleChange}
=======
            onChange={handleChnage}
>>>>>>> fdefd433b03155f1aeac596ea016c94089e07a9d
          />
        ) : (
          <Select filter={filter} key={filter} />
        )
      )}
    </div>
  )
}

ArtifactsFilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default ArtifactsFilterMenu
