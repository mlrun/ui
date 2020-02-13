import React from 'react'
import PropTypes from 'prop-types'

import actionMenuIcon from '../../images/elipsis.png'

const ActionsMenu = ({ convertToYaml, item }) => {
  const showActionsList = e => {
    const actionsBlock = e.target.closest('.row__actions__container')
    actionsBlock.classList.add('row__actions_visible')
  }
  return (
    <div className="row__actions__container">
      <button onClick={showActionsList}>
        <img src={actionMenuIcon} alt="show more" />
      </button>
      <div className="row__actions__body">
        <div
          className="row__actions__body_option"
          onClick={() => convertToYaml(item)}
        >
          View YAML
        </div>
      </div>
    </div>
  )
}

ActionsMenu.defaultProps = {
  item: {}
}

ActionsMenu.propTypes = {
  convertToYaml: PropTypes.func.isRequired,
  item: PropTypes.shape({})
}

export default ActionsMenu
