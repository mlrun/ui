import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import { FeatureSetsPanelSchemaTable } from '../FeatureSetsPanelSchemaTable/FeatureSetsPanelSchemaTable'
import Input from '../../../common/Input/Input'

import { tableHeaders } from './featureSetPanelSchema.util'

import './featureSetsPanelSchema.scss'

const FeatureSetsPanelSchemaView = ({
  addNewItem,
  data,
  isEntityNameValid,
  handleAddNewItem,
  handleDeleteEntity,
  setAddNewItem,
  setData,
  setNewFeatureSetSchemaTimestampKey
}) => {
  return (
    <div className="feature-set-panel__item new-item-side-panel__item schema">
      <FeatureSetsPanelSection title="Schema">
        <FeatureSetsPanelSchemaTable
          addNewItem={addNewItem}
          className="schema__table"
          content={data.entities}
          data={data}
          handleAddNewItem={handleAddNewItem}
          handleDeleteEntity={handleDeleteEntity}
          headers={tableHeaders}
          isEntityNameValid={isEntityNameValid}
          setAddNewItem={setAddNewItem}
          setNewItemName={name => {
            setData(state => ({
              ...state,
              newEntity: {
                ...state.newEntity,
                name
              }
            }))
          }}
          setNewItemValue={value_type => {
            setData(state => ({
              ...state,
              newEntity: {
                ...state.newEntity,
                value_type
              }
            }))
          }}
        />
        <Input
          onChange={timestamp_key =>
            setData(state => ({ ...state, timestamp_key }))
          }
          onBlur={event => {
            setNewFeatureSetSchemaTimestampKey(event.target.value)
          }}
          placeholder="Timestamp key"
        />
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelSchemaView.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  data: PropTypes.shape({}).isRequired,
  isEntityNameValid: PropTypes.bool.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteEntity: PropTypes.func.isRequired,
  setAddNewItem: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetSchemaTimestampKey: PropTypes.func.isRequired
}

export default FeatureSetsPanelSchemaView
