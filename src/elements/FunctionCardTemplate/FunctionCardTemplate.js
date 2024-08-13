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
import { get } from 'lodash'

import { FormChipCell, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getChipOptions } from '../../utils/getChipOptions'

import './functionCardTemplate.scss'

const FunctionCardTemplate = ({
  className = '',
  dense = false,
  formState = {},
  functionData,
  onSelectCard,
  selected = false
}) => {
  const templateClassName = classnames(
    'job-card-template',
    dense && 'dense',
    selected && 'selected',
    className
  )

  return (
    <div className={templateClassName} onClick={event => onSelectCard(event)}>
      <div className="job-card-template__header">
        <Tooltip template={<TextTooltipTemplate text={functionData.header} />}>
          {functionData.header}
        </Tooltip>
        {functionData.subHeader && (
          <div className="job-card-template__sub-header">
            <Tooltip template={<TextTooltipTemplate text={functionData.subHeader} />}>
              {functionData.subHeader}
            </Tooltip>
          </div>
        )}
      </div>
      {functionData.sideTag && (
        <div className="job-card-template__side-tag">{functionData.sideTag}</div>
      )}
      <div className="job-card-template__description">{functionData.description}</div>
      {functionData.labelsName && get(formState?.values, functionData.labelsName, null) && (
        <FormChipCell
          chipOptions={getChipOptions('metrics')}
          className="job-card-template__chips"
          formState={formState}
          initialValues={formState.initialValues}
          name={functionData.labelsName}
        />
      )}
      {functionData.links && (
        <div className="job-card-template__links">
          <a
            className="link"
            href={functionData.links.documentation}
            target="_blank"
            rel="noreferrer"
            onClick={event => event.stopPropagation()}
          >
            Documentation
          </a>
          <a
            className="link"
            href={functionData.links.examples}
            target="_blank"
            rel="noreferrer"
            onClick={event => event.stopPropagation()}
          >
            Examples
          </a>
        </div>
      )}
    </div>
  )
}

FunctionCardTemplate.propTypes = {
  className: PropTypes.string,
  dense: PropTypes.bool,
  formState: PropTypes.shape({}),
  functionData: PropTypes.shape({
    header: PropTypes.string.isRequired,
    subHeader: PropTypes.string,
    description: PropTypes.string,
    sideTag: PropTypes.string
  }).isRequired,
  onSelectCard: PropTypes.func.isRequired,
  selected: PropTypes.bool
}

export default FunctionCardTemplate
