import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Button from '../../common/Button/Button'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Select from '../../common/Select/Select'

import functionsActions from '../../actions/functions'
import { DEFAULT_RUNTIME, runtimeOptions } from './newFuctionPopUp.util'

import './newFunctionPopUp.scss'

const NewFunctionPopUp = ({
  action,
  setNewFunctionKind,
  setFunctionsPanelIsOpen
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)
  const [selectedRuntime, setSelectedRuntime] = useState(DEFAULT_RUNTIME)
  const newFunctionBtn = useRef(null)

  const closePopUp = () => {
    setIsPopUpOpen(false)
    setSelectedRuntime(DEFAULT_RUNTIME)
  }

  const selectRuntime = runtime => {
    setSelectedRuntime(runtime)
    setNewFunctionKind(runtime)
  }

  return (
    <div className="new-function">
      <Button
        ref={newFunctionBtn}
        variant={action.variant}
        label={action.label}
        tooltip={action.tooltip}
        disabled={action.disabled}
        onClick={() => setIsPopUpOpen(true)}
      />
      {isPopUpOpen && (
        <PopUpDialog
          className="new-function__pop-up"
          closePopUp={closePopUp}
          customPosition={{
            element: newFunctionBtn,
            position: 'bottom-left'
          }}
          headerText="Select runtime"
        >
          <Select
            className="project-name"
            density="chunky"
            floatingLabel
            label="Runtime"
            onClick={selectRuntime}
            options={runtimeOptions}
            selectedId={selectedRuntime}
          />
          <div className="pop-up-dialog__footer-container">
            <Button
              variant="label"
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={closePopUp}
            />
            <Button
              variant="primary"
              label="Select"
              onClick={() => {
                setFunctionsPanelIsOpen(true)
                setIsPopUpOpen(false)
                setSelectedRuntime(DEFAULT_RUNTIME)
              }}
            />
          </div>
        </PopUpDialog>
      )}
    </div>
  )
}

NewFunctionPopUp.propTypes = {
  action: PropTypes.shape({}).isRequired,
  setFunctionsPanelIsOpen: PropTypes.func.isRequired
}

export default connect(
  functionsStore => ({
    ...functionsStore
  }),
  { ...functionsActions }
)(NewFunctionPopUp)
