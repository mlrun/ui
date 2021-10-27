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

  return (
    <PopUpDialog
      className="new-feature-vector__pop-up"
      headerText="Create feature vector"
      closePopUp={closePopUp}
    >
      <div className="new-feature-vector__row new-feature-vector__name-tag-row">
        <Input
          className="vector-name"
          wrapperClassName="vector-name-wrapper"
          floatingLabel
          label="Vector name"
          onChange={setFeatureVectorName}
          type="text"
          value={featureVectorName}
          required
        />
        <Input
          className="vector-tag"
          wrapperClassName="vector-tag-wrapper"
          floatingLabel
          label="Tag"
          onChange={setFeatureVectorTag}
          type="text"
          value={featureVectorTag}
          required
        />
      </div>
      <div className="new-feature-vector__row new-feature-vector__description-row">
        <TextArea
          floatingLabel
          label="Description"
          value={featureVectorDescription}
          onChange={setFeatureVectorDescription}
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
          disabled={!featureVectorName.trim() || !featureVectorTag.trim()}
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
