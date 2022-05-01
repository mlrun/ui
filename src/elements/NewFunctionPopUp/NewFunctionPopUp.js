import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { Button, PopUpDialog } from 'igz-controls/components'

import functionsActions from '../../actions/functions'
import { DEFAULT_RUNTIME, runtimeOptions } from './newFuctionPopUp.util'
import { useMode } from '../../hooks/mode.hook'
import { useOpenPanel } from '../../hooks/openPanel.hook'
import { getValidationRules } from '../../utils/validationService'

import './newFunctionPopUp.scss'

const NewFunctionPopUp = ({
  action,
  closePopUp,
  functionsStore,
  isCustomPosition,
  isOpened,
  setNewFunctionKind,
  setNewFunctionName,
  setNewFunctionTag,
  setFunctionsPanelIsOpen
}) => {
  const [data, setData] = useState({
    name: '',
    runtime: DEFAULT_RUNTIME,
    tag: ''
  })
  const [isPopUpOpen, setIsPopUpOpen] = useState(isOpened ?? false)
  const [validation, setValidation] = useState({
    isNameValid: true,
    isTagValid: true
  })
  const { isStagingMode } = useMode()
  const openPanelByDefault = useOpenPanel()
  const newFunctionBtn = useRef(null)
  const popUpClassNames = classnames(
    'new-function__pop-up',
    isCustomPosition && 'new-function__pop-up_short'
  )

  const handleClosePopUp = () => {
    closePopUp ? closePopUp() : setIsPopUpOpen(false)
    setData({
      name: '',
      runtime: DEFAULT_RUNTIME,
      tag: ''
    })
    setValidation({
      isNameValid: true,
      isTagValid: true
    })
  }

  const checkValidation = () => {
    return !Object.values(validation).includes(false)
  }

  const handleNameOnBlur = () => {
    if (data.name !== functionsStore.newFunction.metadata.name) {
      setNewFunctionName(data.name)
    }
  }

  const handleTagOnBlur = () => {
    if (data.tag !== functionsStore.newFunction.metadata.tag) {
      setNewFunctionTag(data.tag)
    }
  }

  const selectRuntime = runtime => {
    setData(state => ({ ...state, runtime }))
    setNewFunctionKind(runtime)
  }

  useEffect(() => {
    if (openPanelByDefault) {
      setIsPopUpOpen(true)
    }
  }, [openPanelByDefault])

  return (
    <div className="new-function">
      {isCustomPosition && (
        <Button
          ref={newFunctionBtn}
          variant={action.variant}
          label={action.label}
          tooltip={action.tooltip}
          disabled={action.disabled}
          onClick={() => setIsPopUpOpen(true)}
        />
      )}
      {isPopUpOpen && (
        <PopUpDialog
          className={popUpClassNames}
          closePopUp={handleClosePopUp}
          customPosition={
            isCustomPosition
              ? {
                  element: newFunctionBtn,
                  position: 'bottom-left'
                }
              : {}
          }
          headerText="Create New Function"
        >
          <div className="new-function__pop-up-inputs">
            <Input
              floatingLabel
              invalid={!validation.isNameValid}
              label="Name"
              maxLength={63}
              onChange={name => setData(state => ({ ...state, name }))}
              onBlur={handleNameOnBlur}
              required
              setInvalid={value =>
                setValidation(state => ({ ...state, isNameValid: value }))
              }
              validationRules={getValidationRules('common.name')}
              value={data.name}
              wrapperClassName="name"
            />
            <Input
              floatingLabel
              invalid={!validation.isTagValid}
              label="Tag"
              onChange={tag => setData(state => ({ ...state, tag }))}
              onBlur={handleTagOnBlur}
              placeholder="latest"
              setInvalid={value =>
                setValidation(state => ({ ...state, isTagValid: value }))
              }
              validationRules={getValidationRules('common.tag')}
              value={data.tag}
              wrapperClassName="tag"
            />
          </div>
          <Select
            className="project-name"
            density="chunky"
            floatingLabel
            label="Runtime"
            onClick={selectRuntime}
            options={runtimeOptions(isStagingMode)}
            selectedId={data.runtime}
          />
          <div className="pop-up-dialog__footer-container">
            <Button
              variant="label"
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={handleClosePopUp}
            />
            <Button
              disabled={!checkValidation()}
              label="Continue"
              onClick={() => {
                if (checkValidation()) {
                  if (data.name.length === 0) {
                    return setValidation(state => ({
                      ...state,
                      isNameValid: false
                    }))
                  }

                  setFunctionsPanelIsOpen(true)
                  handleClosePopUp()
                }
              }}
              variant="primary"
            />
          </div>
        </PopUpDialog>
      )}
    </div>
  )
}

NewFunctionPopUp.defaultProps = {
  action: null,
  closePopUp: null,
  isCustomPosition: false,
  isOpened: false
}

NewFunctionPopUp.propTypes = {
  action: PropTypes.shape({}),
  closePopUp: PropTypes.func,
  isCustomPosition: PropTypes.bool,
  isOpened: PropTypes.bool,
  setFunctionsPanelIsOpen: PropTypes.func.isRequired
}

export default connect(
  functionsStore => ({
    ...functionsStore
  }),
  { ...functionsActions }
)(NewFunctionPopUp)
