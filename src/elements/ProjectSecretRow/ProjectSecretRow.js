import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

import './projectSecretRow.scss'

const ProjectSecretRow = ({ handleEditClick, handleSecretDelete, secret }) => {
  return (
    <div className="secret__row">
      <div className="secret__cell secret__body">
        <Tooltip template={<TextTooltipTemplate text={secret} />}>
          <span>{secret}</span>
        </Tooltip>
      </div>
      <div className="secret__cell secret__actions">
        <Tooltip template={<TextTooltipTemplate text="Edit" />}>
          <button
            className="action__button"
            onClick={() => handleEditClick(secret)}
          >
            <Edit />
          </button>
        </Tooltip>
        <Tooltip template={<TextTooltipTemplate text="Delete" />}>
          <button
            className="action__button"
            onClick={() => handleSecretDelete(secret)}
          >
            <Delete />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

ProjectSecretRow.propTypes = {
  handleEditClick: PropTypes.func.isRequired,
  handleSecretDelete: PropTypes.func.isRequired,
  secret: PropTypes.string.isRequired
}

export default ProjectSecretRow
