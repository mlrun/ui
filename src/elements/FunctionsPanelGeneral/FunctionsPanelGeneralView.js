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

import { FormChipCell } from 'igz-controls/components'
import PanelSection from '../PanelSection/PanelSection'
import TextArea from '../../common/TextArea/TextArea'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getInternalLabelsValidationRule } from 'igz-controls/utils/validation.util'
import { getChipOptions } from '../../utils/getChipOptions'

import { TAG_LATEST } from '../../constants'

import './functionsPanelGeneral.scss'

const FunctionsPanelGeneralView = ({
  data,
  frontendSpec,
  formState,
  handleDescriptionOnBlur,
  setData
}) => {
  return (
    <div className="functions-panel__item new-item-side-panel__item general">
      <PanelSection title="General">
        <div className="general__required-info">
          <div className="name">
            <Tooltip template={<TextTooltipTemplate text={data.name} />}>
              Name: <span>{data.name}</span>
            </Tooltip>
          </div>
          <div className="tag data-ellipsis">
            <Tooltip template={<TextTooltipTemplate text={data.tag || TAG_LATEST} />}>
              Tag: <span>{data.tag || TAG_LATEST}</span>
            </Tooltip>
          </div>
          <div className="runtime">
            Runtime: <span>{data.kind}</span>
          </div>
        </div>
        <TextArea
          floatingLabel
          label="Description"
          maxLength={500}
          onChange={description =>
            setData(state => ({
              ...state,
              description
            }))
          }
          onBlur={handleDescriptionOnBlur}
          type="text"
          value={data.description}
          wrapperClassName="description"
        />
        <div className="general__labels-container">
          <div className="general__labels-text">Labels</div>
          <div className="general__labels-wrapper">
            <FormChipCell
              chipOptions={getChipOptions('labels')}
              formState={formState}
              initialValues={formState.initialValues}
              isEditable
              label=""
              name="labels"
              shortChips
              visibleChipsMaxLength="all"
              validationRules={{
                key: [getInternalLabelsValidationRule(frontendSpec?.internal_labels || [])],
                value: []
              }}
            />
          </div>
        </div>
      </PanelSection>
    </div>
  )
}

FunctionsPanelGeneralView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleDescriptionOnBlur: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFunctionDescription: PropTypes.func.isRequired
}

export default FunctionsPanelGeneralView
