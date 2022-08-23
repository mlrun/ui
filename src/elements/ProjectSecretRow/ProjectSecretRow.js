/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
