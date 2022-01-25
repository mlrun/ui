import React, { useState } from 'react'
import PropTypes from 'prop-types'

// import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Button from '../../common/Button/Button'
import ChipCell from '../../common/ChipCell/ChipCell'
import Input from '../../common/Input/Input'
import Modal from '../../common/Modal/Modal'
import TextArea from '../../common/TextArea/TextArea'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { getValidationRules } from '../../utils/validationService'
import { generateKeyValues, parseKeyValues } from '../../utils'
import { TERTIARY_BUTTON, PRIMARY_BUTTON } from '../../constants'

import './createFeatureVectorPopUp.scss'

const CreateFeatureVectorPopUp = ({
  closePopUp,
  createFeatureVector,
  featureVectorData,
  show
}) => {
  const [tagTooltipIsHidden, setTagTooltipIsHidden] = useState(false)
  const [nameIsValid, setNameIsValid] = useState(true)
  const [featureVectorName, setFeatureVectorName] = useState(
    featureVectorData.name
  )
  const [featureVectorTag, setFeatureVectorTag] = useState(
    featureVectorData.tag || 'latest'
  )
  const [featureVectorDescription, setFeatureVectorDescription] = useState(
    featureVectorData.description
  )
  const [featureVectorLabels, setFeatureVectorLabels] = useState(
    parseKeyValues(featureVectorData.labels)
  )

  return (
    <Modal
      actions={[
        <Button
          variant={TERTIARY_BUTTON}
          label="Cancel"
          className="pop-up-dialog__btn_cancel"
          onClick={closePopUp}
        />,
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
      ]}
      className="new-feature-vector"
      onClose={closePopUp}
      size="sm"
      show={show}
      title={`${!featureVectorData.name ? 'Create' : 'Edit'} feature vector`}
    >
      <div>
        <div className="new-feature-vector__row new-feature-vector__name-tag-row">
          <Input
            className="vector-name"
            floatingLabel
            invalid={!nameIsValid}
            label="Vector name"
            onChange={setFeatureVectorName}
            setInvalid={value => setNameIsValid(value)}
            type="text"
            value={featureVectorName}
            validationRules={getValidationRules('feature.vector.name')}
            wrapperClassName="vector-name-wrapper"
          />
          <Tooltip
            className="vector-tag-wrapper"
            hidden={tagTooltipIsHidden || featureVectorTag.length === 0}
            template={<TextTooltipTemplate text={featureVectorTag} />}
          >
            <Input
              className="vector-tag"
              floatingLabel
              label="Tag"
              onBlur={() => setTagTooltipIsHidden(false)}
              onChange={value => {
                setTagTooltipIsHidden(true)
                setFeatureVectorTag(value)
              }}
              pattern="^(?=[\S\s]{1,56}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$"
              required
              type="text"
              value={featureVectorTag}
            />
          </Tooltip>
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
      </div>
    </Modal>
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
