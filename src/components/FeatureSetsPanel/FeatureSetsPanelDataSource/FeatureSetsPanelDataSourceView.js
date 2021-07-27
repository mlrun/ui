import React from 'react'
import PropTypes from 'prop-types'
import cronstrue from 'cronstrue'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Select from '../../../common/Select/Select'
import Button from '../../../common/Button/Button'
import ScheduleFeatureSet from '../ScheduleFeatureSet/ScheduleFeatureSet'
import KeyValueTable from '../../../common/KeyValueTable/KeyValueTable'
import Combobox from '../../../common/Combobox/Combobox'

import {
  comboboxSelectList,
  kindOptions
} from './featureSetsPanelDataSource.util'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'
import { pathPlaceholders } from '../../../utils/panelPathScheme'
import { ReactComponent as Pencil } from '../../../images/edit.svg'

import './featureSetsPanelDataSource.scss'

const FeatureSetsPanelDataSourceView = ({
  comboboxMatches,
  data,
  handleAddNewItem,
  handleDeleteAttribute,
  handleEditAttribute,
  handleKindOnChange,
  handleUrlOnBlur,
  handleUrlPathTypeChange,
  handleUrlPathChange,
  isUrlValid,
  setData,
  setShowSchedule,
  showSchedule,
  setNewFeatureSetSchedule,
  urlProjectItemTypeEntered
}) => {
  console.log(isUrlValid)
  // const httpKind = 'http', disabling temporarily until backend supports scheduling
  return (
    <div className="feature-set-panel__item new-item-side-panel__item data-source">
      <FeatureSetsPanelSection title="Data Source">
        <div className="data-source__inputs">
          <Select
            className="data-source__inputs-item"
            density="medium"
            floatingLabel
            label="Kind"
            onClick={handleKindOnChange}
            options={kindOptions}
            selectedId={data.kind}
          />
          <Combobox
            comboboxClassName="url"
            hideSearchInput={!urlProjectItemTypeEntered}
            inputDefaultValue={
              data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
                ? data.url.projectItemType
                : ''
            }
            inputOnChange={path => {
              handleUrlPathChange(path)
            }}
            inputPlaceholder={data.url.placeholder}
            invalid={!isUrlValid}
            invalidText={`Field must be in "${
              pathPlaceholders[data.url.pathType]
            }" format`}
            matches={comboboxMatches}
            maxSuggestedMatches={3}
            onBlur={handleUrlOnBlur}
            required
            requiredText="This field is required"
            selectDropdownList={comboboxSelectList}
            selectOnChange={path => {
              handleUrlPathTypeChange(path)
            }}
            selectPlaceholder="Path Scheme"
          />
        </div>
        {false && ( // was: data.kind !== httpKind, disabling temporarily until backend supports scheduling
          <div className="schedule-content">
            <Button
              className="schedule-tumbler"
              label={
                <>
                  {data.schedule
                    ? cronstrue.toString(data.schedule)
                    : 'Schedule'}
                  <Pencil className="schedule-tumbler__icon" />
                </>
              }
              onClick={() => setShowSchedule(state => !state)}
              variant="secondary"
            />
            {showSchedule && (
              <ScheduleFeatureSet
                setNewFeatureSetSchedule={cron => {
                  setNewFeatureSetSchedule(cron)
                  setData(state => ({ ...state, schedule: cron }))
                }}
                setShowSchedule={setShowSchedule}
              />
            )}
          </div>
        )}
        <p>
          Users can add the following parameters to filter the data. using start
          time and end time filter the selected time "between" those two fields.
        </p>
        <KeyValueTable
          addNewItem={handleAddNewItem}
          addNewItemLabel="Add variable"
          className="data-source__table"
          content={data.attributes}
          deleteItem={handleDeleteAttribute}
          editItem={handleEditAttribute}
          keyHeader="Attribute name"
          keyLabel="Name"
          valueHeader="Value"
          valueLabel="Value"
          withEditMode
        />
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelDataSourceView.propTypes = {
  comboboxMatches: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  data: PropTypes.shape({}).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteAttribute: PropTypes.func.isRequired,
  handleEditAttribute: PropTypes.func.isRequired,
  handleKindOnChange: PropTypes.func.isRequired,
  handleUrlOnBlur: PropTypes.func.isRequired,
  handleUrlPathTypeChange: PropTypes.func.isRequired,
  handleUrlPathChange: PropTypes.func.isRequired,
  isUrlValid: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired,
  setNewFeatureSetSchedule: PropTypes.func.isRequired,
  urlProjectItemTypeEntered: PropTypes.bool.isRequired
}

export default FeatureSetsPanelDataSourceView
