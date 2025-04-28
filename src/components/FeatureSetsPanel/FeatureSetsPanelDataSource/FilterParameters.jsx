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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import Input from '../../../common/Input/Input'
import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import DatePicker from '../../../common/DatePicker/DatePicker'

import { END_TIME, START_TIME, TIME_FIELD } from './featureSetsPanelDataSource.util'
import {
  setNewFeatureSetDataSourceEndTime,
  setNewFeatureSetDataSourceStartTime,
  setNewFeatureSetDataSourceTimestampColumn
} from '../../../reducers/featureStoreReducer'

const FilterParameters = ({ setValidation, validation }) => {
  const [data, setData] = useState({
    timeField: '',
    startTime: '',
    endTime: ''
  })
  const dispatch = useDispatch()
  const featureStore = useSelector(state => state.featureStore)

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
      dispatch(setNewFeatureSetDataSourceTimestampColumn(''))
      dispatch(setNewFeatureSetDataSourceStartTime(''))
      dispatch(setNewFeatureSetDataSourceEndTime(''))
    }
  }, [dispatch, setValidation])

  const handleTimestampColumnOnBlur = event => {
    if (featureStore.newFeatureSet.spec.source.time_field !== event.target.value) {
      dispatch(setNewFeatureSetDataSourceTimestampColumn(event.target.value))
      setData(state => ({
        ...state,
        timeField: event.target.value
      }))
    }

    if (data.endTime.length === 0 && data.startTime.length === 0 && data.timeField.length === 0) {
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

  const validateDates = (startTime, endTime) => {
    if (startTime && endTime) {
      return startTime.toISOString() < endTime.toISOString()
    } else {
      return true
    }
  }

  const handleChangeDates = (date, type) => {
    const setTime =
      type === START_TIME ? setNewFeatureSetDataSourceStartTime : setNewFeatureSetDataSourceEndTime

    if (date[0]) {
      dispatch(setTime(date[0].toISOString()))

      if (type === START_TIME) {
        setValidation(prevState => ({
          ...prevState,
          isEndTimeValid: true,
          isStartTimeValid: validateDates(date[0], data.endTime)
        }))
      } else {
        setValidation(prevState => ({
          ...prevState,
          isEndTimeValid: validateDates(data.startTime, date[0]),
          isStartTimeValid: true
        }))
      }
    } else {
      dispatch(setTime(''))
      setValidation(prevState => ({
        ...prevState,
        isTimeFieldValid: true,
        isStartTimeValid: type === START_TIME && data.endTime ? false : true,
        isEndTimeValid: type === END_TIME && data.startTime ? false : true
      }))
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
          required={Boolean(data.timeField.length > 0 || data.startTime || data.endTime)}
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
          externalInvalid={!validation.isStartTimeValid}
          externalInvalidMessage="Start time is invalid"
          label="Start time"
          onChange={date => handleChangeDates(date, START_TIME)}
          required={Boolean((data.timeField || data.endTime) && !data.startTime)}
          setExternalInvalid={value =>
            setValidation(state => ({
              ...state,
              isStartTimeValid: value
            }))
          }
          tip="Filter data by start date >= value"
          type="date-time"
        />
        <DatePicker
          className="data-source__inputs-item"
          date={data.endTime}
          externalInvalid={!validation.isEndTimeValid}
          externalInvalidMessage="End time is invalid"
          label="End time"
          onChange={date => handleChangeDates(date, END_TIME)}
          required={Boolean((data.timeField || data.startTime) && !data.endTime)}
          setExternalInvalid={value =>
            setValidation(state => ({
              ...state,
              isEndTimeValid: value
            }))
          }
          tip="Filter data by start date <= value"
          type="date-time"
        />
      </div>
    </FeatureSetsPanelSection>
  )
}

FilterParameters.propTypes = {
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default FilterParameters
