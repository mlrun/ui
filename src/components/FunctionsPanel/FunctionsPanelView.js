import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import Accordion from '../../common/Accordion/Accordion'
import FunctionsPanelGeneral from '../../elements/FunctionsPanelGeneral/FunctionsPanelGeneral'
import FunctionsPanelCode from '../../elements/FunctionsPanelCode/FunctionsPanelCode'
import FunctionsPanelResources from '../../elements/FunctionsPanelResources/FunctionsPanelResources'
import FunctionsPanelEnvironmentVariables from '../../elements/FunctionsPanelEnvironmentVariables/FunctionsPanelEnvironmentVariables'
import Button from '../../common/Button/Button'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import FunctionsPanelSecrets from '../../elements/FunctionsPanelSecrets/FunctionsPanelSecrets'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './functionsPanel.scss'

const FunctionsPanelView = ({
  closePanel,
  error,
  handleSave,
  isNameValid,
  isTagValid,
  loading,
  removeFunctionsError,
  setNameValid,
  setTagValid
}) => {
  return (
    <div className="new-item-side-panel-container">
      <div className="functions-panel new-item-side-panel">
        {loading && <Loader />}
        <FunctionsPanelTitle closePanel={closePanel} />
        <div className="new-item-side-panel__body">
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FunctionsPanelGeneral
              isNameValid={isNameValid}
              isTagValid={isTagValid}
              setNameValid={setNameValid}
              setTagValid={setTagValid}
            />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FunctionsPanelCode />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FunctionsPanelResources />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FunctionsPanelEnvironmentVariables />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FunctionsPanelSecrets />
          </Accordion>
          <div className="new-item-side-panel__buttons-container">
            {error && (
              <ErrorMessage
                closeError={() => {
                  if (error) {
                    removeFunctionsError()
                  }
                }}
                message={error}
              />
            )}
            <Button
              className="btn_cancel"
              variant="label"
              label="Cancel"
              onClick={closePanel}
            />
            <Button
              className="btn_save"
              disabled={!isTagValid || !isNameValid}
              variant="tertiary"
              label="Save"
              onClick={() => handleSave()}
            />
            <Button
              variant="secondary"
              label="Deploy"
              onClick={() => handleSave(true)}
              disabled={!isTagValid || !isNameValid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

FunctionsPanelView.defaultProps = {
  error: ''
}

FunctionsPanelView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  error: PropTypes.string,
  handleSave: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isTagValid: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  removeFunctionsError: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setTagValid: PropTypes.func.isRequired
}

export default FunctionsPanelView
