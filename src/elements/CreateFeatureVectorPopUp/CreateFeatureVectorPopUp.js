import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ChipCell from '../../common/ChipCell/ChipCell'
import Input from '../../common/Input/Input'
import TextArea from '../../common/TextArea/TextArea'
import { Button, PopUpDialog } from 'igz-controls/components'

import { getValidationRules } from '../../utils/validationService'
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
        <Input
          className="vector-tag"
          floatingLabel
          invalid={!validation.isTagValid}
          label="Tag"
          onChange={setFeatureVectorTag}
          required
          setInvalid={value => setValidation(state => ({ ...state, isTagValid: value }))}
          type="text"
          validationRules={getValidationRules('common.tag')}
          value={featureVectorTag}
        />
      </div>
      <div className="new-feature-vector__row new-feature-vector__description-row">
        <TextArea
          floatingLabel
          label="Description"
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
