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
import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { FormInput, FormOnChange, FormSelect } from 'igz-controls/components'

import {
  getLimitsGpuType,
  getSelectedCpuOption,
  getSelectedMemoryOption,
  selectUnitOptions
} from './formResourcesUnits.util'
import { isCommunityEdition } from '../../utils/helper'

import './formResourcesUnits.scss'

const FormResourcesUnits = ({ formState, onChangeEnabled = true }) => {
  const gpuType = useMemo(
    () => getLimitsGpuType(formState.values.resources?.currentLimits),
    [formState.values.resources]
  )
  const selectedRequestUnit = useMemo(
    () => getSelectedCpuOption(formState.values.resources?.currentRequest?.cpuUnitId),
    [formState.values.resources]
  )
  const selectedLimitUnit = useMemo(
    () => getSelectedCpuOption(formState.values.resources?.currentLimits?.cpuUnitId),
    [formState.values.resources]
  )

  const validateMemory = (value, allValues) => {
    const convertToBites = (value, unitData) => {
      return parseInt(value) * Math.pow(unitData.root, unitData.power)
    }

    const limits = Number.parseInt(allValues.resources.currentLimits?.memory)
    const requests = Number.parseInt(allValues.resources.currentRequest?.memory)

    const selectedLimitsOption = getSelectedMemoryOption(
      allValues.resources.currentLimits?.memoryUnitId
    )
    const selectedRequestsOption = getSelectedMemoryOption(
      allValues.resources.currentRequest?.memoryUnitId
    )

    const isValid =
      convertToBites(limits, selectedLimitsOption) >=
      convertToBites(requests, selectedRequestsOption)

    if (!isValid) {
      return 'Field is invalid'
    }
  }

  const validateCpu = (value, allValues) => {
    const limitsValue = allValues.resources.currentLimits?.cpu
    const requestsValue = allValues.resources.currentRequest?.cpu
    const selectedLimitsOption = getSelectedCpuOption(allValues.resources.currentLimits?.cpuUnitId)
    const selectedRequestsOption = getSelectedCpuOption(
      allValues.resources.currentRequest?.cpuUnitId
    )

    const isValid =
      selectedRequestsOption.convertValue(requestsValue) <=
      selectedLimitsOption.convertValue(limitsValue)

    if (!isValid) {
      return 'Field is invalid'
    }
  }

  const handleSelectCpuUnit = (value, type) => {
    const selectedOption = getSelectedCpuOption(value)
    formState.form.change(
      `resources.${type}.cpu`,
      selectedOption.onChange(formState.values.resources[type].cpu)
    )
  }

  useEffect(() => {
    if (
      formState.modified['resources.currentRequest.memoryUnitId'] ||
      formState.modified['resources.currentLimits.memoryUnitId'] ||
      formState.modified['resources.currentRequest.memory'] ||
      formState.modified['resources.currentLimits.memory']
    ) {
      formState.form.mutators.setFieldState('resources.currentRequest.memory', { modified: true })
      formState.form.mutators.setFieldState('resources.currentLimits.memory', { modified: true })
    }

    if (
      formState.modified['resources.currentRequest.cpuUnitId'] ||
      formState.modified['resources.currentLimits.cpuUnitId'] ||
      formState.modified['resources.currentRequest.cpu'] ||
      formState.modified['resources.currentLimits.cpu']
    ) {
      formState.form.mutators.setFieldState('resources.currentRequest.cpu', { modified: true })
      formState.form.mutators.setFieldState('resources.currentLimits.cpu', { modified: true })
    }
  }, [formState.form.mutators, formState.modified])

  return (
    <>
      <div className="form-row resources-units" data-testid="form-resources-units-tbl">
        <div className="form-col-1">
          <div className="resources-card">
            <div className="resources-card__title">Memory</div>
            <div className="resources-card__fields">
              <FormInput
                className="resources-card__fields-input"
                name="resources.currentRequest.memory"
                label="Request"
                type="number"
                min={1}
                validator={(value, allValues) => validateMemory(value, allValues)}
                required={!isCommunityEdition()}
                invalidText="Request must be less than or equal to Limit and not be less than 1"
              />
              <FormSelect
                className="resources-card__fields-select"
                name="resources.currentRequest.memoryUnitId"
                options={selectUnitOptions.unitMemory}
              />
            </div>
            <div className="resources-card__fields">
              <FormInput
                className="resources-card__fields-input"
                name="resources.currentLimits.memory"
                label="Limit"
                type="number"
                min={1}
                validator={(value, allValues) => validateMemory(value, allValues)}
                required={!isCommunityEdition()}
                invalidText="Limit must be bigger than or equal to Request and not be less than 1"
              />
              <FormSelect
                className="resources-card__fields-select"
                name="resources.currentLimits.memoryUnitId"
                options={selectUnitOptions.unitMemory}
              />
            </div>
          </div>
        </div>
        <div className="form-col-1">
          <div className="resources-card">
            <div className="resources-card__title">CPU</div>
            <div className="resources-card__fields">
              <FormInput
                className="resources-card__fields-input"
                name="resources.currentRequest.cpu"
                label="Request"
                type="number"
                min={selectedRequestUnit?.minValue ?? 1}
                step={selectedRequestUnit?.step ?? 1}
                validator={validateCpu}
                required={!isCommunityEdition()}
                invalidText={`Request must be less than or equal to Limit and not be less than ${selectedRequestUnit?.minValue}`}
              />
              <FormSelect
                className="resources-card__fields-select"
                name="resources.currentRequest.cpuUnitId"
                options={selectUnitOptions.unitCpu}
              />
            </div>
            <div className="resources-card__fields">
              <FormInput
                className="resources-card__fields-input"
                name="resources.currentLimits.cpu"
                label="Limit"
                type="number"
                min={selectedLimitUnit?.minValue ?? 1}
                step={selectedLimitUnit?.step ?? 1}
                validator={validateCpu}
                required={!isCommunityEdition()}
                invalidText={`Limit must be bigger than or equal to Request and not be less than ${selectedLimitUnit?.minValue}`}
              />
              <FormSelect
                className="resources-card__fields-select"
                name="resources.currentLimits.cpuUnitId"
                options={selectUnitOptions.unitCpu}
              />
            </div>
          </div>
        </div>
        <div className="form-col-1">
          <div className="resources-card">
            <div className="resources-card__title">GPU</div>
            <div className="resources-card__fields">
              <FormInput
                className="resources-card__fields-input gpu"
                name={`resources.currentLimits[${gpuType}]`}
                label="Limit"
                type="number"
                min={1}
              />
            </div>
          </div>
        </div>
      </div>
      {onChangeEnabled && (
        <FormOnChange
          handler={(value, prevValue) => {
            handleSelectCpuUnit(value, 'currentRequest')
          }}
          name="resources.currentRequest.cpuUnitId"
        />
      )}
      {onChangeEnabled && (
        <FormOnChange
          handler={(value, prevValue) => {
            handleSelectCpuUnit(value, 'currentLimits')
          }}
          name="resources.currentLimits.cpuUnitId"
        />
      )}
    </>
  )
}

FormResourcesUnits.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  onChangeEnabled: PropTypes.bool
}

export default FormResourcesUnits
