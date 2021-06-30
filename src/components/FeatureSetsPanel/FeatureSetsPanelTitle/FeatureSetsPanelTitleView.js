import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Input from '../../../common/Input/Input'
import ChipCell from '../../../common/ChipCell/ChipCell'
import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'
import TextArea from '../../../common/TextArea/TextArea'

import { ReactComponent as Close } from '../../../images/close.svg'

import './featureSetsPanelTitle.scss'

const FeatureSetsPanelTitleView = ({
  artifactsStore,
  closePanel,
  data,
  handleAddLabel,
  handleChangeLabels,
  handleNameChange,
  handleNameOnBlur,
  isNameValid,
  setData,
  setNewFeatureSetDescription,
  setNewFeatureSetVersion
}) => {
  const titleValidationTip = (
    <>
      <span>&bull; Valid characters: A-Z, a-z, 0-9, -, _, .</span>
      <br />
      <span>&bull; Must begin and end with: A-Z, a-z, 0-9</span>
      <br />
      <span>&bull; Length - max: 63</span>
    </>
  )

  return (
    <div className="panel-title feature-sets-panel__title">
      <div className="panel-title__container">
        <div className="feature-sets-panel__title-required-info">
          <Input
            className="panel-title__input"
            floatingLabel
            label="Feature Set Name"
            onChange={handleNameChange}
            onBlur={handleNameOnBlur}
            maxLength={63}
            pattern="^(?=[\S\s]{1,63}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$"
            required={!isNameValid}
            requiredText={
              data.name.length === 0
                ? 'This field is required'
                : 'This field is invalid'
            }
            tip={titleValidationTip}
            type="text"
            value={data.name}
            wrapperClassName="name"
          />
          <Input
            className="panel-title__input"
            floatingLabel
            label="Version"
            onChange={version =>
              setData(state => ({
                ...state,
                version
              }))
            }
            onBlur={event => {
              if (
                artifactsStore.newFeatureSet.metadata.tag !== event.target.value
              ) {
                setNewFeatureSetVersion(event.target.value)
              }
            }}
            placeholder="latest"
            type="text"
            value={data.version}
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
              artifactsStore.newFeatureSet.spec.description !==
              event.target.value
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
              isEditMode={true}
              removeChip={handleChangeLabels}
            />
          </div>
        </div>
      </div>
      <button onClick={() => closePanel({})} className="panel-title__btn_close">
        <Tooltip template={<TextTooltipTemplate text="Close" />}>
          <Close />
        </Tooltip>
      </button>
    </div>
  )
}

FeatureSetsPanelTitleView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
  handleAddLabel: PropTypes.func.isRequired,
  handleChangeLabels: PropTypes.func.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleNameOnBlur: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetDescription: PropTypes.func.isRequired,
  setNewFeatureSetVersion: PropTypes.func.isRequired
}

export default connect(({ artifactsStore }) => ({
  artifactsStore
}))(FeatureSetsPanelTitleView)
