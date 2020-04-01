import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'
import { ReactComponent as Yaml } from '../../images/yaml.svg'

import './tableActionsMenu.scss'

const TableActionsMenu = ({ toggleConvertToYaml, item, time }) => {
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
      className="table-actions-container"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button onClick={showActionsList}>
        <ActionMenu />
      </button>
      {isShowMenu && (
        <div
          className="table-actions-container__body"
          onClick={() => setIsShowMenu(false)}
        >
          <div
            className="table-actions-container__option"
            onClick={() => {
              toggleConvertToYaml(item)
            }}
          >
            <Yaml className="table-actions-container__icon" />
            View YAML
          </div>
        </div>
      )}
    </div>
  )
}

TableActionsMenu.defaultProps = {
  item: {},
  time: 100
}

TableActionsMenu.propTypes = {
  toggleConvertToYaml: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  time: PropTypes.number
}

export default TableActionsMenu
