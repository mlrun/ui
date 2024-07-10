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

import CheckBox from '../../../common/CheckBox/CheckBox'
import { FormChipCell } from 'igz-controls/components'
import Input from '../../../common/Input/Input'
import TextArea from '../../../common/TextArea/TextArea'
import { RoundedIcon, Tip } from 'igz-controls/components'

import { getValidationRules, getInternalLabelsValidationRule } from 'igz-controls/utils/validation.util'
import { getChipOptions } from '../../../utils/getChipOptions'

import { ReactComponent as CloseIcon } from 'igz-controls/images/close.svg'

import './featureSetsPanelTitle.scss'

const FeatureSetsPanelTitleView = ({
  closePanel,
  data,
  featureStore,
  formState,
  frontendSpec,
  handleCheckPassthrough,
  handleNameOnBlur,
  setData,
  setNewFeatureSetDescription,
  setNewFeatureSetVersion,
  setValidation,
  validation
}) => {
  return (
    <div className="panel-title feature-sets-panel__title">
      <div className="panel-title__container">
        <div className="feature-sets-panel__title-required-info">
          <Input
            className="panel-title__input"
            floatingLabel
            invalid={!validation.isNameValid}
            invalidText="This field is invalid"
            label="Feature Set Name"
            onChange={name => setData(state => ({ ...state, name }))}
            onBlur={handleNameOnBlur}
            required
            requiredText="This field is required"
            setInvalid={value => setValidation(state => ({ ...state, isNameValid: value }))}
            type="text"
            validationRules={getValidationRules('feature.vector.name')}
            value={data.name}
            wrapperClassName="name"
          />
          <Input
            className="panel-title__input"
            floatingLabel
            invalid={!validation.isTagValid}
            label="Version"
            onChange={version =>
              setData(state => ({
                ...state,
                version
              }))
            }
            onBlur={event => {
              if (featureStore.newFeatureSet.metadata.tag !== event.target.value) {
                setNewFeatureSetVersion(event.target.value)
              }
            }}
            placeholder="latest"
            setInvalid={value => setValidation(state => ({ ...state, isTagValid: value }))}
            type="text"
            value={data.version}
            validationRules={getValidationRules('feature.sets.tag')}
            wrapperClassName="version"
          />
        </div>
        <TextArea
          className="panel-title__input"
          floatingLabel
          label="Description"
          maxLength={500}
          onChange={description =>
            setData(state => ({
              ...state,
              description
            }))
          }
          onBlur={event => {
            if (featureStore.newFeatureSet.spec.description !== event.target.value) {
              setNewFeatureSetDescription(event.target.value)
            }
          }}
          type="text"
          value={data.description}
        />
        <div className="panel-title__labels-container">
          <div className="panel-title__labels-text">Labels</div>
          <div className="panel-title__labels-wrapper">
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
        <CheckBox
          item={{ id: 'passthrough', label: 'Passthrough' }}
          onChange={id => handleCheckPassthrough(id)}
          selectedId={data.passthrough}
        >
          <span>Passthrough</span>
          <Tip
            className="checkbox__label-tip"
            text="Select Passthrough to read data directly from the source without ingesting the data to the offline target. Transformations (computation graph, aggregations, etc.) are invalid when this feature is enabled."
          />
        </CheckBox>
      </div>
      <RoundedIcon
        onClick={() => closePanel({})}
        className="panel-title__btn_close"
        tooltipText="Close"
        data-testid="pop-up-close-btn"
      >
        <CloseIcon />
      </RoundedIcon>
    </div>
  )
}

FeatureSetsPanelTitleView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
  featureStore: PropTypes.shape({}).isRequired,
  handleNameOnBlur: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetDescription: PropTypes.func.isRequired,
  setNewFeatureSetVersion: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelTitleView
