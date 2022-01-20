import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import FeatureSetsPanelTitle from './FeatureSetsPanelTitle/FeatureSetsPanelTitle'
import FeatureSetsPanelDataSource from './FeatureSetsPanelDataSource/FeatureSetsPanelDataSource'
import FeatureSetsPanelSchema from './FeatureSetsPanelSchema/FeatureSetsPanelSchema'
import FeatureSetsPanelTargetStore from './FeatureSetsPanelTargetStore/FeatureSetsPanelTargetStore'
import Loader from '../../common/Loader/Loader'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
import PanelCredentialsAccessKey from '../../elements/PanelCredentialsAccessKey/PanelCredentialsAccessKey'

import { PRIMARY_BUTTON } from '../../constants'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './featureSetsPanel.scss'

const FeatureSetsPanelView = ({
  accessKeyRequired,
  confirmDialog,
  featureStore,
  handleSave,
  loading,
  project,
  setConfirmDialog,
  setNewFeatureSetCredentialsAccessKey,
  setValidation,
  validation
}) => {
  return (
    <div>
      {loading && <Loader />}
      {confirmDialog && (
        <ConfirmDialog
          closePopUp={() => setConfirmDialog(null)}
          confirmButton={{
            handler: handleSave,
            label: 'Okay',
            variant: PRIMARY_BUTTON
          }}
          message="Note that data will be ingested to the feature set without any transformation and therefore you won't be able to add a transformation graph unless you delete the data first."
        />
      )}
      <FeatureSetsPanelTitle
        setValidation={setValidation}
        validation={validation}
      />
      <div className="new-item-side-panel__body">
        <Accordion
          accordionClassName="new-item-side-panel__accordion"
          icon={<Arrow />}
          iconClassName="new-item-side-panel__expand-icon"
          openByDefault
        >
          <FeatureSetsPanelDataSource
            project={project}
            setValidation={setValidation}
            validation={validation}
          />
        </Accordion>
        <Accordion
          accordionClassName="new-item-side-panel__accordion"
          icon={<Arrow />}
          iconClassName="new-item-side-panel__expand-icon"
          openByDefault
        >
          <FeatureSetsPanelSchema
            setValidation={setValidation}
            validation={validation}
          />
        </Accordion>
        <Accordion
          accordionClassName="new-item-side-panel__accordion"
          icon={<Arrow />}
          iconClassName="new-item-side-panel__expand-icon"
          openByDefault
        >
          <FeatureSetsPanelTargetStore
            setValidation={setValidation}
            validation={validation}
          />
        </Accordion>
        <PanelCredentialsAccessKey
          credentialsAccessKey={
            featureStore.newFeatureSet.credentials.access_key
          }
          required={accessKeyRequired}
          setCredentialsAccessKey={setNewFeatureSetCredentialsAccessKey}
          setValidation={setValidation}
          validation={validation}
        />
      </div>
    </div>
  )
}

FeatureSetsPanelView.defaultProps = {
  confirmDialog: null,
  defaultData: null,
  error: false
}

FeatureSetsPanelView.propTypes = {
  accessKeyRequired: PropTypes.bool.isRequired,
  confirmDialog: PropTypes.shape({ action: PropTypes.string.isRequired }),
  featureStore: PropTypes.shape({}).isRequired,
  handleSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  project: PropTypes.string.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
  setNewFeatureSetCredentialsAccessKey: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelView
