import React, { useState } from 'react'
import PropTypes from 'prop-types'

import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import TextArea from '../../common/TextArea/TextArea'
import ChipCell from '../../common/ChipCell/ChipCell'

import { generateKeyValues, parseKeyValues } from '../../utils'
import { LABEL_BUTTON, PRIMARY_BUTTON } from '../../constants'

import './createFeatureVectorPopUp.scss'

const CreateFeatureVectorPopUp = ({
  closePopUp,
  createFeatureVector,
  featureVectorData
}) => {
  const [nameIsValid, setNameIsValid] = useState(true)
  const [featureVectorName, setFeatureVectorName] = useState(
    featureVectorData.name
  )
  const [featureVectorTag, setFeatureVectorTag] = useState(
    featureVectorData.tag
  )
  const [featureVectorDescription, setFeatureVectorDescription] = useState(
    featureVectorData.description
  )
  const [featureVectorLabels, setFeatureVectorLabels] = useState(
    parseKeyValues(featureVectorData.labels)
  )

  const nameValidationTip = (
    <>
      <span>&bull; Valid characters: A-Z, a-z, 0-9, -, _, .</span>
      <br />
      <span>&bull; Must begin and end with: A-Z, a-z, 0-9</span>
      <br />
      <span>&bull; Length - max: 56</span>
    </>
  )

  return (
    <PopUpDialog
      className="new-feature-vector__pop-up"
      headerText={`${
        !featureVectorData.name ? 'Create' : 'Edit'
      } feature vector`}
      closePopUp={closePopUp}
    >
      <div className="new-feature-vector__row new-feature-vector__name-tag-row">
        <Input
          className="vector-name"
          floatingLabel
          invalid={!nameIsValid}
          label="Vector name"
          onChange={setFeatureVectorName}
          pattern="^(?=[\S\s]{1,56}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$"
          required
          setInvalid={value => setNameIsValid(value)}
          tip={nameValidationTip}
          type="text"
          value={featureVectorName}
          wrapperClassName="vector-name-wrapper"
        />
        <Input
          className="vector-tag"
          floatingLabel
          label="Tag"
          onChange={setFeatureVectorTag}
          required
          type="text"
          value={featureVectorTag}
          wrapperClassName="vector-tag-wrapper"
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
            isEditMode={true}
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
            !nameIsValid
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
