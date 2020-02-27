import React from 'react'
import PropTypes from 'prop-types'

import actionMenuIcon from '../../images/elipsis.png'

import './actionsMenu.scss'

const ActionsMenu = ({ convertToYaml, item }) => {
  const showActionsList = e => {
    const actionsBlock = e.target.closest('.row__actions__container')
    // if (actionsBlock.classList.value.includes('row__actions_visible')) {
    //   actionsBlock.classList.remove('row__actions_visible')
    // } else {
    actionsBlock.classList.add('row__actions_visible')
    // }
  }

  return (
    <div className="row__actions__container">
      <button onClick={showActionsList}>
        <img src={actionMenuIcon} alt="show more" />
      </button>
      <div className="row__actions__body">
        <div
          className="row__actions__body_option"
          onClick={() => {
            convertToYaml(item)
          }}
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
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
}

export default ActionsMenu
