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
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ChipCell from '../../common/ChipCell/ChipCell'
import Input from '../../common/Input/Input'
import TextArea from '../../common/TextArea/TextArea'
import { Button, PopUpDialog, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getValidationRules } from 'igz-controls/utils/validation.util'
import { generateKeyValues, parseKeyValues } from '../../utils'
import { TAG_LATEST } from '../../constants'
import { LABEL_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'

import './createFeatureVectorPopUp.scss'

const CreateFeatureVectorPopUp = ({ closePopUp, createFeatureVector, featureVectorData }) => {
  const [featureVectorName, setFeatureVectorName] = useState(featureVectorData.name)
  const [featureVectorTag, setFeatureVectorTag] = useState(featureVectorData.tag || TAG_LATEST)
  const [featureVectorDescription, setFeatureVectorDescription] = useState(
    featureVectorData.description
  )
  const [featureVectorLabels, setFeatureVectorLabels] = useState(
    parseKeyValues(featureVectorData.labels)
  )
  const [tagTooltipIsHidden, setTagTooltipIsHidden] = useState(false)
  const [validation, setValidation] = useState({
    isNameValid: true,
    isTagValid: true
  })

  return (
    <PopUpDialog
      className="new-feature-vector__pop-up"
      headerText={`${!featureVectorData.name ? 'Create' : 'Edit'} feature vector`}
      closePopUp={closePopUp}
    >
      <div className="new-feature-vector__row new-feature-vector__name-tag-row">
        <Input
          className="vector-name"
          floatingLabel
          invalid={!validation.isNameValid}
          label="Vector name"
          onChange={setFeatureVectorName}
          required
          setInvalid={value => setValidation(state => ({ ...state, isNameValid: value }))}
          type="text"
          value={featureVectorName}
          wrapperClassName="vector-name-wrapper"
          validationRules={getValidationRules('feature.vector.name')}
        />
        <Tooltip
          className="vector-tag-wrapper"
          hidden={tagTooltipIsHidden || featureVectorTag.length === 0}
          template={<TextTooltipTemplate text={featureVectorTag} />}
        >
          <Input
            className="vector-tag"
            floatingLabel
            invalid={!validation.isTagValid}
            label="Tag"
            onBlur={() => setTagTooltipIsHidden(false)}
            onChange={value => {
              setTagTooltipIsHidden(true)
              setFeatureVectorTag(value)
            }}
            required
            setInvalid={value => setValidation(state => ({ ...state, isTagValid: value }))}
            type="text"
            validationRules={getValidationRules('common.tag')}
            value={featureVectorTag}
          />
        </Tooltip>
      </div>
      <div className="new-feature-vector__row new-feature-vector__description-row">
        <TextArea
          floatingLabel
          label="Description"
          maxLength={500}
          onChange={setFeatureVectorDescription}
          value={featureVectorDescription}
        />
      </div>
      <div className="new-feature-vector__row new-feature-vector__labels-row">
        <div className="labels-container">
          <div className="labels-container__title">Labels</div>
          <ChipCell
            addChip={(label, labels) => {
              setFeatureVectorLabels([...labels, label])
            }}
            editChip={setFeatureVectorLabels}
            elements={featureVectorLabels}
            isEditMode
            removeChip={setFeatureVectorLabels}
          />
        </div>
      </div>
      <div className="pop-up-dialog__footer-container">
        <Button
          variant={LABEL_BUTTON}
          label="Cancel"
          className="pop-up-dialog__btn_cancel"
          onClick={closePopUp}
        />
        <Button
          variant={PRIMARY_BUTTON}
          label="Create"
          disabled={
            !featureVectorName.trim() ||
            !featureVectorTag.trim() ||
            !validation.isNameValid ||
            !validation.isTagValid
          }
          onClick={() =>
            createFeatureVector({
              name: featureVectorName,
              tag: featureVectorTag,
              description: featureVectorDescription,
              labels: generateKeyValues(featureVectorLabels)
            })
          }
        />
      </div>
    </PopUpDialog>
  )
}

CreateFeatureVectorPopUp.defaultProps = {
  featureVectorData: {
    name: '',
    tag: '',
    description: '',
    labels: {}
  }
}

CreateFeatureVectorPopUp.propTypes = {
  closePopUp: PropTypes.func.isRequired,
  featureVectorData: PropTypes.shape({
    name: PropTypes.string,
    tag: PropTypes.string,
    description: PropTypes.string,
    labels: PropTypes.shape({})
  })
}

export default CreateFeatureVectorPopUp
