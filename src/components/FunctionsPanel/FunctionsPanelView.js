import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './functionsPanel.scss'
import Accordion from '../../common/Accordion/Accordion'
import FunctionsPanelGeneral from '../../elements/FunctionsPanelGeneral/FunctionsPanelGeneral'

const FunctionsPanelView = ({
  closePanel,
  error,
  handleSave,
  isNameValid,
  isTagValid,
  loading,
  removeArtifactsError,
  setNameValid,
  setTagValid,
  setTransformationsValue,
  transformationsValue
}) => {
  return (
    <div className="new-item-side-panel-container">
      <div className="functions-panel new-item-side-panel">
        {loading && <Loader />}
        <FunctionsPanelTitle closePanel={closePanel} />
        {/*<FeatureSetsPanelTitle*/}
        {/*  closePanel={closePanel}*/}
        {/*  isNameValid={isNameValid}*/}
        {/*  isVersionValid={isVersionValid}*/}
        {/*  setNameValid={setNameValid}*/}
        {/*  setVersionValid={setVersionValid}*/}
        {/*/>*/}
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
          {/*  <Accordion*/}
          {/*    accordionClassName="new-item-side-panel__accordion"*/}
          {/*    icon={<Arrow />}*/}
          {/*    iconClassName="new-item-side-panel__expand-icon"*/}
          {/*    openByDefault*/}
          {/*  >*/}
          {/*    <FeatureSetsPanelDataSource*/}
          {/*      isUrlValid={isUrlValid}*/}
          {/*      setUrlValid={setUrlValid}*/}
          {/*    />*/}
          {/*  </Accordion>*/}
          {/*  <Accordion*/}
          {/*    accordionClassName="new-item-side-panel__accordion"*/}
          {/*    icon={<Arrow />}*/}
          {/*    iconClassName="new-item-side-panel__expand-icon"*/}
          {/*    openByDefault*/}
          {/*  >*/}
          {/*    <FeatureSetsPanelSchema />*/}
          {/*  </Accordion>*/}
          {/*  <Accordion*/}
          {/*    accordionClassName="new-item-side-panel__accordion"*/}
          {/*    icon={<Arrow />}*/}
          {/*    iconClassName="new-item-side-panel__expand-icon"*/}
          {/*    openByDefault*/}
          {/*  >*/}
          {/*    <FeatureSetsPanelTargetStore />*/}
          {/*  </Accordion>*/}
          {/*  <FeatureSetsPanelTransformations*/}
          {/*    setTransformationsValue={setTransformationsValue}*/}
          {/*    transformationsValue={transformationsValue}*/}
          {/*  />*/}
          {/*  <div className="new-item-side-panel__buttons-container">*/}
          {/*    {error && (*/}
          {/*      <ErrorMessage*/}
          {/*        closeError={() => {*/}
          {/*          if (error) {*/}
          {/*            removeArtifactsError()*/}
          {/*          }*/}
          {/*        }}*/}
          {/*        message={error}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*    <Button*/}
          {/*      variant="tertiary"*/}
          {/*      label="Cancel"*/}
          {/*      className="pop-up-dialog__btn_cancel"*/}
          {/*      onClick={closePanel}*/}
          {/*    />*/}
          {/*    <Button*/}
          {/*      variant="secondary"*/}
          {/*      label="Save"*/}
          {/*      onClick={() => handleSave(false)}*/}
          {/*    />*/}
          {/*    {transformationsValue === TRANSFORMATIONS_DEFAULT_VALUE && (*/}
          {/*      <Button*/}
          {/*        className="btn_start-ingestion"*/}
          {/*        label="Save and ingest"*/}
          {/*        onClick={() => handleSave(true)}*/}
          {/*        variant="secondary"*/}
          {/*      />*/}
          {/*    )}*/}
          {/*  </div>*/}
        </div>
      </div>
    </div>
  )
}

FunctionsPanelView.defaultProps = {
  defaultData: null,
  error: false
}

FunctionsPanelView.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  handleSave: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isUrlValid: PropTypes.bool.isRequired,
  isVersionValid: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  removeArtifactsError: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setTagValid: PropTypes.func.isRequired,
  setTypeValid: PropTypes.func.isRequired,
  setTransformationsValue: PropTypes.func.isRequired,
  transformationsValue: PropTypes.string.isRequired
}

export default FunctionsPanelView
