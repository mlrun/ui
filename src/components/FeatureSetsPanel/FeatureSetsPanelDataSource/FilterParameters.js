import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Input from '../../../common/Input/Input'
import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import DatePicker from '../../../common/DatePicker/DatePicker'

import {
  END_TIME,
  START_TIME,
  TIME_FIELD
} from './featureSetsPanelDataSource.util'
import featureStoreActions from '../../../actions/featureStore'

const FilterParameters = ({
  featureStore,
  setNewFeatureSetDataSourceEndTime,
  setNewFeatureSetDataSourceStartTime,
  setNewFeatureSetDataSourceTimestampColumn,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    timeField: '',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    return () => {
      setData(state => ({
        ...state,
        endTime: '',
        startTime: '',
        timeField: ''
      }))
      setValidation(prevState => ({
        ...prevState,
        isTimeFieldValid: true,
        isStartTimeValid: true,
        isEndTimeValid: true
      }))
      setNewFeatureSetDataSourceTimestampColumn('')
      setNewFeatureSetDataSourceStartTime('')
      setNewFeatureSetDataSourceEndTime('')
    }
  }, [
    setNewFeatureSetDataSourceEndTime,
    setNewFeatureSetDataSourceStartTime,
    setNewFeatureSetDataSourceTimestampColumn,
    setValidation
  ])

  const handleTimestampColumnOnBlur = event => {
    if (
      featureStore.newFeatureSet.spec.source.time_field !== event.target.value
    ) {
      setNewFeatureSetDataSourceTimestampColumn(event.target.value)
      setData(state => ({
        ...state,
        timeField: event.target.value
      }))
    }

    if (
      data.endTime.length === 0 &&
      data.startTime.length === 0 &&
      data.timeField.length === 0
    ) {
      setValidation(prevState => ({
        ...prevState,
        isTimeFieldValid: true,
        isStartTimeValid: true,
        isEndTimeValid: true
      }))
    } else if (data.timeField.length > 0 && data.startTime.length > 0) {
      setValidation(prevState => ({
        ...prevState,
        isEndTimeValid: true
      }))
    } else if (data.timeField.length > 0 && data.endTime.length > 0) {
      setValidation(prevState => ({
        ...prevState,
        isStartTimeValid: true
      }))
    }
  }

  const handleChangeDates = (date, type) => {
    const setTime =
      type === START_TIME
        ? setNewFeatureSetDataSourceStartTime
        : setNewFeatureSetDataSourceEndTime

    if (date[0]) {
      setTime(date[0].toISOString())

      if (data.timeField.length > 0) {
        if (type === START_TIME) {
          setValidation(prevState => ({
            ...prevState,
            isEndTimeValid: true
          }))
        } else {
          setValidation(prevState => ({
            ...prevState,
            isStartTimeValid: true
          }))
        }
      }
    } else {
      setTime('')
    }

    setData(state => ({
      ...state,
      [type]: date[0]
    }))
  }

  return (
    <FeatureSetsPanelSection title="Filter Parameters">
      <span className="data-source__description">
        Users can add the following parameters to filter the data.
      </span>
      <div className="data-source__inputs-container">
        <Input
          floatingLabel
          invalid={!validation.isTimeFieldValid}
          invalidText="Timestamp key is invalid"
          label="Timestamp column"
          onBlur={event => handleTimestampColumnOnBlur(event, TIME_FIELD)}
          onChange={value =>
            setData(state => ({
              ...state,
              [TIME_FIELD]: value
            }))
          }
          required={Boolean(
            data.timeField.length > 0 || data.startTime || data.endTime
          )}
          requiredText="Timestamp key is required"
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isTimeFieldValid: value
            }))
          }
          tip="The field name for filtering the source data."
          type="text"
          value={data.timeField}
          wrapperClassName="data-source__inputs-item"
        />
        <DatePicker
          className="data-source__inputs-item"
          date={data.startTime}
          invalid={!validation.isStartTimeValid}
          invalidText="Start time is invalid"
          label="Start time"
          onChange={date => handleChangeDates(date, START_TIME)}
          required={Boolean(
            (data.timeField.length > 0 || data.startTime.length > 0) &&
              data.endTime.length === 0
          )}
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isStartTimeValid: value
            }))
          }
          tip="Filter data by start date >= value"
          type="date"
        />
        <DatePicker
          className="data-source__inputs-item"
          date={data.endTime}
          invalid={!validation.isEndTimeValid}
          invalidText="End time is invalid"
          label="End time"
          onChange={date => handleChangeDates(date, END_TIME)}
          required={Boolean(
            (data.timeField.length > 0 || data.endTime.length > 0) &&
              data.startTime.length === 0
          )}
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEndTimeValid: value
            }))
          }
          tip="Filter data by start date <= value"
          type="date"
        />
      </div>
    </FeatureSetsPanelSection>
  )
}

FilterParameters.propTypes = {
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(FilterParameters)
