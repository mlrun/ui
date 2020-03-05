import React, { useState } from 'react'
import PropTypes from 'prop-types'

import actionMenuIcon from '../../images/elipsis.png'

import yamlIcon from '../../images/yaml.png'

import './actionsMenu.scss'

const ActionsMenu = ({ convertToYaml, item, time = 100 }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  let idTimeout = null

  const showActionsList = e => {
    setIsShowMenu(!isShowMenu)
  }

  const handleMouseLeave = event => {
    if (isShowMenu) {
      idTimeout = setTimeout(() => {
        setIsShowMenu(false)
      }, time)
    }
  }

  const handleMouseEnter = () => {
    if (idTimeout) clearTimeout(idTimeout)
  }
  return (
    <div
      className="row__actions__container"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button onClick={showActionsList}>
        <img src={actionMenuIcon} alt="show more" />
      </button>
      {isShowMenu && (
        <div
          className="row__actions__body"
          onClick={() => setIsShowMenu(false)}
        >
          <div
            className="row__actions__body_option"
            onClick={() => {
              convertToYaml(item)
            }}
          >
            <img src={yamlIcon} alt="yaml" />
            View YAML
          </div>
        </div>
      )}
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
