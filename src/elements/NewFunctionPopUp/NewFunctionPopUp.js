import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Button from '../../common/Button/Button'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Select from '../../common/Select/Select'
import Input from '../../common/Input/Input'

import functionsActions from '../../actions/functions'
import { DEFAULT_RUNTIME, runtimeOptions } from './newFuctionPopUp.util'
import { useDemoMode } from '../../hooks/demoMode.hook'

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
    isNameValid: true
  })
  const isDemoMode = useDemoMode()
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
      isNameValid: true
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
              pattern="^(?=[\S\s]{1,63}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$"
              required
              setInvalid={value =>
                setValidation(state => ({ ...state, isNameValid: value }))
              }
              tip={
                <>
                  <span>&bull; Valid characters: a-z, 0-9, -</span>
                  <br />
                  <span>&bull; Must begin and end with: a-z, 0-9</span>
                  <br />
                  <span>&bull; Length - max: 63</span>
                </>
              }
              value={data.name}
              wrapperClassName="name"
            />
            <Input
              floatingLabel
              label="Tag"
              onChange={tag => setData(state => ({ ...state, tag }))}
              onBlur={handleTagOnBlur}
              placeholder="latest"
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
            options={runtimeOptions(isDemoMode)}
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
