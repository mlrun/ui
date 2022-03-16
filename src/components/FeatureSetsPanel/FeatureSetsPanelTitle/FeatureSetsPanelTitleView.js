import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Input from '../../../common/Input/Input'
import ChipCell from '../../../common/ChipCell/ChipCell'
import TextArea from '../../../common/TextArea/TextArea'
import RoundedIcon from '../../../common/RoundedIcon/RoundedIcon'

import { getValidationRules } from '../../../utils/validationService'

import { ReactComponent as CloseIcon } from '../../../images/close.svg'

import './featureSetsPanelTitle.scss'

const FeatureSetsPanelTitleView = ({
  closePanel,
  data,
  featureStore,
  handleAddLabel,
  handleChangeLabels,
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
            setInvalid={value =>
              setValidation(state => ({ ...state, isNameValid: value }))
            }
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
              if (
                featureStore.newFeatureSet.metadata.tag !== event.target.value
              ) {
                setNewFeatureSetVersion(event.target.value)
              }
            }}
            placeholder="latest"
            setInvalid={value =>
              setValidation(state => ({ ...state, isTagValid: value }))
            }
            type="text"
            value={data.version}
            validationRules={getValidationRules('common.tag')}
            wrapperClassName="version"
          />
        </div>
        <TextArea
          className="panel-title__input"
          floatingLabel
          label="Description"
          onChange={description =>
            setData(state => ({
              ...state,
              description
            }))
          }
          onBlur={event => {
            if (
              featureStore.newFeatureSet.spec.description !== event.target.value
            ) {
              setNewFeatureSetDescription(event.target.value)
            }
          }}
          type="text"
          value={data.description}
        />
        <div className="panel-title__labels-container">
          <div className="panel-title__labels-text">Labels</div>
          <div className="panel-title__labels-wrapper">
            <ChipCell
              addChip={handleAddLabel}
              className="panel-title__labels-item"
              editChip={handleChangeLabels}
              elements={data.labels}
              isEditMode
              removeChip={handleChangeLabels}
            />
          </div>
        </div>
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
  handleAddLabel: PropTypes.func.isRequired,
  handleChangeLabels: PropTypes.func.isRequired,
  handleNameOnBlur: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetDescription: PropTypes.func.isRequired,
  setNewFeatureSetVersion: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(({ artifactsStore }) => ({
  artifactsStore
}))(FeatureSetsPanelTitleView)
