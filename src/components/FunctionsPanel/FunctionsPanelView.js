import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import Accordion from '../../common/Accordion/Accordion'
import FunctionsPanelGeneral from '../../elements/FunctionsPanelGeneral/FunctionsPanelGeneral'
import FunctionsPanelCode from '../../elements/FunctionsPanelCode/FunctionsPanelCode'
import FunctionsPanelResources from '../../elements/FunctionsPanelResources/FunctionsPanelResources'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './functionsPanel.scss'

const FunctionsPanelView = ({
  closePanel,
  isNameValid,
  isTagValid,
  loading,
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
        </div>
      </div>
    </div>
  )
}

FunctionsPanelView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isTagValid: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setTagValid: PropTypes.func.isRequired
}

export default FunctionsPanelView
