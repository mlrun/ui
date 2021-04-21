import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Button from '../../common/Button/Button'
import FeatureSetsPanelTitle from './FeatureSetsPanelTitle/FeatureSetsPanelTitle'
import FeatureSetsPanelDataSource from './FeatureSetsPanelDataSource/FeatureSetsPanelDataSource'
import FeatureSetsPanelSchema from './FeatureSetsPanelSchema/FeatureSetsPanelSchema'
import FeatureSetsPanelTargetStore from './FeatureSetsPanelTargetStore/FeatureSetsPanelTargetStore'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './featureSetsPanel.scss'

const FeatureSetsPanelView = ({
  closePanel,
  error,
  handleSave,
  isNameValid,
  isUrlValid,
  isVersionValid,
  removeArtifactsError,
  setNameValid,
  setUrlValid,
  setVersionValid
}) => {
  return (
    <div className="new-item-side-panel-container">
      <div className="feature-set-panel new-item-side-panel">
        <FeatureSetsPanelTitle
          closePanel={closePanel}
          isNameValid={isNameValid}
          isVersionValid={isVersionValid}
          setNameValid={setNameValid}
          setVersionValid={setVersionValid}
        />
        <div className="new-item-side-panel__body">
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelDataSource
              isUrlValid={isUrlValid}
              setUrlValid={setUrlValid}
            />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelSchema />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelTargetStore />
          </Accordion>
          <div className="new-item-side-panel__buttons-container">
            {error && (
              <ErrorMessage
                closeError={() => {
                  if (error) {
                    removeArtifactsError()
                  }
                }}
                message={error}
              />
            )}
            <Button
              variant="tertiary"
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={closePanel}
            />
            <Button variant="secondary" label="Save" onClick={handleSave} />
          </div>
        </div>
      </div>
    </div>
  )
}

FeatureSetsPanelView.defaultProps = {
  defaultData: null,
  error: false
}

FeatureSetsPanelView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  handleSave: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isUrlValid: PropTypes.bool.isRequired,
  isVersionValid: PropTypes.bool.isRequired,
  removeArtifactsError: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setUrlValid: PropTypes.func.isRequired,
  setVersionValid: PropTypes.func.isRequired
}

export default FeatureSetsPanelView
