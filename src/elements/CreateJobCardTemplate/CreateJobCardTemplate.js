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
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { truncateUid } from '../../utils'

import './createJobCardTemplate.scss'

const CreateJobCardTemplate = ({ className = '', func, handleSelectGroupFunctions }) => {
  const templateClassName = classnames('card-template', className)

  return (
    <div className={templateClassName} onClick={() => handleSelectGroupFunctions(func)}>
      <h6 className="card-template__header">
        <Tooltip template={<TextTooltipTemplate text={func.name || func?.metadata.name} />}>
          {func.name || func?.metadata.name}
        </Tooltip>
      </h6>
      {func.metadata && (
        <>
          <Tooltip
            template={<TextTooltipTemplate text={func.metadata.hash} />}
            className="card-template__hash"
          >
            <span>{truncateUid(func.metadata.hash)}</span>
          </Tooltip>
          <span className="card-template__tag">{func.metadata.tag}</span>
          <div className="card-template__description">{func.metadata.description}</div>
        </>
      )}
    </div>
  )
}

CreateJobCardTemplate.propTypes = {
  className: PropTypes.string,
  func: PropTypes.shape({}).isRequired,
  handleSelectGroupFunctions: PropTypes.func.isRequired
}

export default CreateJobCardTemplate
