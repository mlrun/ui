import React, { useState } from 'react'
import PropTypes from 'prop-types'

import actionMenuIcon from '../../images/elipsis.png'
import yamlIcon from '../../images/yaml.png'

import './actionsMenu.scss'

const ActionsMenu = ({ toggleConvertToYaml, item, time }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  let idTimeout = null

  const showActionsList = () => {
    setIsShowMenu(!isShowMenu)
  }

  const handleMouseLeave = () => {
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
      className="actions-container"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button onClick={showActionsList}>
        <img src={actionMenuIcon} alt="show more" />
      </button>
      {isShowMenu && (
        <div
          className="actions-container__body"
          onClick={() => setIsShowMenu(false)}
        >
          <div
            className="actions-container__option"
            onClick={() => {
              toggleConvertToYaml(item)
            }}
          >
            <img
              src={yamlIcon}
              alt="yaml"
              className="actions-container__icon"
            />
            View YAML
          </div>
        </div>
      )}
    </div>
  )
}

ActionsMenu.defaultProps = {
  item: {},
  time: 100
}

ActionsMenu.propTypes = {
  toggleConvertToYaml: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  time: PropTypes.number
}

export default ActionsMenu
