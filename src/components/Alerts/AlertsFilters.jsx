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
import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useForm, useFormState } from 'react-final-form'
import { upperFirst } from 'lodash'

import MultiSelectFilter from '../../common/MultiSelectFilter/MultiSelectFilter'
import { FormSelect, FormInput, FormOnChange } from 'igz-controls/components'

import { generateProjectsList } from '../../utils/projects'
import {
  allProjectsOption,
  filterAlertsEntityTypeOptions,
  filterAlertsEventTypeOptions,
  filterAlertsSeverityOptions
} from './alerts.util'

import {
  ENDPOINT_APPLICATION,
  ENDPOINT_RESULT,
  ENTITY_ID,
  ENTITY_TYPE,
  EVENT_TYPE,
  FILTER_ALL_ITEMS,
  JOB,
  JOB_NAME,
  MODEL_ENDPOINT_RESULT,
  MODEL_MONITORING_APPLICATION,
  PROJECT_FILTER,
  SEVERITY
} from '../../constants'

const AlertsFilters = ({ isAlertsPage, isCrossProjects }) => {
  const form = useForm()
  const {
    values: { [ENTITY_TYPE]: entityType }
  } = useFormState()

  const location = useLocation()

  const projectStore = useSelector(state => state.projectStore)

  const projectsList = useMemo(() => {
    const generatedProjects = generateProjectsList(projectStore.projectsNames.data)

    return [...allProjectsOption, ...generatedProjects].map(item => ({
      ...item,
      label: item.label
    }))
  }, [projectStore.projectsNames.data])

  const getFieldsToReset = useCallback(entityType => {
    const fieldsByType = {
      [FILTER_ALL_ITEMS]: [ENTITY_ID],
      [MODEL_MONITORING_APPLICATION]: [ENTITY_ID],
      [JOB]: [JOB_NAME],
      [MODEL_ENDPOINT_RESULT]: [ENDPOINT_APPLICATION, ENDPOINT_RESULT, ENTITY_ID]
    }
    const allFields = [ENTITY_ID, JOB_NAME, ENDPOINT_APPLICATION, ENDPOINT_RESULT]

    return allFields.filter(field => !(fieldsByType[entityType] ?? []).includes(field))
  }, [])

  useEffect(() => {
    getFieldsToReset(entityType).forEach(field => form.change(field, ''))
  }, [entityType, form, getFieldsToReset])

  const handleInputChange = (value, inputName) => {
    form.change(inputName, value || '')
  }

  const handleEntityTypeChange = selectedValue => {
    const params = Object.fromEntries(new URLSearchParams(location.search))

    form.change(
      EVENT_TYPE,
      params[ENTITY_TYPE] === selectedValue ||
        (entityType === FILTER_ALL_ITEMS && params[EVENT_TYPE])
        ? params[EVENT_TYPE]
        : FILTER_ALL_ITEMS
    )
  }

  return (
    <>
      {isCrossProjects && (
        <div className="form-row">
          <FormSelect
            label="Project name"
            name={PROJECT_FILTER}
            options={projectsList}
            preventWidthOverflow
          />
        </div>
      )}
      {isAlertsPage && (
        <div className="form-row">
          <FormSelect
            label="Entity type"
            name={ENTITY_TYPE}
            options={filterAlertsEntityTypeOptions}
          />
          <FormOnChange handler={handleEntityTypeChange} name={ENTITY_TYPE} />
        </div>
      )}

      {(entityType === FILTER_ALL_ITEMS ||
        entityType === MODEL_MONITORING_APPLICATION ||
        entityType === MODEL_ENDPOINT_RESULT) && (
          <div className="form-row">
            <FormInput
              label={entityType === MODEL_ENDPOINT_RESULT ? 'Endpoint ID' : 'Entity ID'}
              name={ENTITY_ID}
              placeholder="Search by ID"
              tip="Search for case insensitive, full or partial strings"
            />
            <FormOnChange handler={value => handleInputChange(value, ENTITY_ID)} name={ENTITY_ID} />
          </div>
        )}
      {entityType === JOB && (
        <div className="form-row">
          <FormInput
            label={upperFirst(JOB)}
            name={JOB_NAME}
            placeholder="Search by job name"
            tip="Search for case insensitive, full or partial strings"
          />
          <FormOnChange handler={value => handleInputChange(value, JOB_NAME)} name={JOB_NAME} />
        </div>
      )}
      {entityType === MODEL_ENDPOINT_RESULT && (
        <>
          <div className="form-row">
            <FormInput
              label="Endpoint Application"
              name={ENDPOINT_APPLICATION}
              placeholder="Search by application"
              tip="Search for case insensitive, full or partial strings"
            />
            <FormOnChange
              handler={value => handleInputChange(value, ENDPOINT_APPLICATION)}
              name={ENDPOINT_APPLICATION}
            />
          </div>
          <div className="form-row">
            <FormInput
              label="Endpoint Result"
              name={ENDPOINT_RESULT}
              placeholder="Search by result"
              tip="Search for case insensitive, full or partial strings"
            />
            <FormOnChange
              handler={value => handleInputChange(value, ENDPOINT_RESULT)}
              name={ENDPOINT_RESULT}
            />
          </div>
        </>
      )}
      <div className="form-row">
        <MultiSelectFilter optionsList={filterAlertsSeverityOptions} name={SEVERITY} />
      </div>
      <div className="form-row">
        <FormSelect
          label="Event type"
          name={EVENT_TYPE}
          options={filterAlertsEventTypeOptions(entityType)}
          preventWidthOverflow
        />
      </div>
    </>
  )
}

AlertsFilters.propTypes = {
  isAlertsPage: PropTypes.bool.isRequired,
  isCrossProjects: PropTypes.bool.isRequired
}

export default AlertsFilters
