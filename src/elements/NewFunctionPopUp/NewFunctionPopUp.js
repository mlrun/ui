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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { Button, PopUpDialog } from 'igz-controls/components'

import functionsActions from '../../actions/functions'
import { runtimeOptions } from './newFuctionPopUp.util'
import { useMode } from '../../hooks/mode.hook'
import { useOpenPanel } from '../../hooks/openPanel.hook'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { FUNCTION_TYPE_JOB } from '../../constants'

import './newFunctionPopUp.scss'

const NewFunctionPopUp = ({
  action = null,
  closePopUp = null,
  functionsStore,
  isCustomPosition = false,
  isOpened = false,
  setNewFunctionKind,
  setNewFunctionName,
  setNewFunctionTag,
  setFunctionsPanelIsOpen
}) => {
  const [data, setData] = useState({
    name: '',
    runtime: FUNCTION_TYPE_JOB,
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
  const location = useLocation()
  const runtime = new URLSearchParams(location.search).get('runtime') // TODO: Delete after new wizard implemented

  const popUpClassNames = classnames(
    'new-function__pop-up',
    isCustomPosition && 'new-function__pop-up_short'
  )

  const handleClosePopUp = () => {
    closePopUp ? closePopUp() : setIsPopUpOpen(false)
    setData({
      name: '',
      runtime: FUNCTION_TYPE_JOB,
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

  const selectRuntime = useCallback(
    runtime => {
      setData(state => ({ ...state, runtime }))
      setNewFunctionKind(runtime)
    },
    [setNewFunctionKind]
  )

  useEffect(() => {
    if (openPanelByDefault) {
      setIsPopUpOpen(true)
    }

    if (runtime) {
      selectRuntime(runtime)
    }
  }, [openPanelByDefault, selectRuntime, runtime])

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
              setInvalid={value => setValidation(state => ({ ...state, isNameValid: value }))}
              validationRules={getValidationRules('function.name')}
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
              setInvalid={value => setValidation(state => ({ ...state, isTagValid: value }))}
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
