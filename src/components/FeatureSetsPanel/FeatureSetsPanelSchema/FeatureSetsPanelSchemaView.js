import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Input from '../../../common/Input/Input'

import './featureSetsPanelSchema.scss'

const FeatureSetsPanelSchemaView = ({
  data,
  featureStore,
  handleEntitiesOnBlur,
  setData,
  setNewFeatureSetSchemaTimestampKey
}) => {
  return (
    <div className="feature-set-panel__item new-item-side-panel__item schema">
      <FeatureSetsPanelSection title="Schema">
        <div className="schema__inputs">
          <Input
            floatingLabel
            label="Entities"
            onBlur={handleEntitiesOnBlur}
            onChange={entities => {
              setData(state => ({
                ...state,
                entities
              }))
            }}
            placeholder="entity1,entity2,entity3"
            type="text"
            value={data.entities}
          />
          <Input
            onChange={timestamp_key =>
              setData(state => ({ ...state, timestamp_key }))
            }
            onBlur={event => {
              if (
                featureStore.newFeatureSet.spec.timestamp_key !==
                event.target.value
              ) {
                setNewFeatureSetSchemaTimestampKey(event.target.value)
              }
            }}
            placeholder="Timestamp key"
            type="text"
          />
        </div>
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelSchemaView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  featureStore: PropTypes.shape({}).isRequired,
  handleEntitiesOnBlur: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetSchemaTimestampKey: PropTypes.func.isRequired
}

export default FeatureSetsPanelSchemaView
