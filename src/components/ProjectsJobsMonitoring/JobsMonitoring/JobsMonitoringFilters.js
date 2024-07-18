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
import React, { useMemo } from 'react'
import { useForm } from 'react-final-form'

import { FormInput, FormOnChange, FormSelect } from 'igz-controls/components'

import {
  JOBS_MONITORING_JOBS_TAB,
  LABELS_FILTER,
  PROJECT_FILTER
} from '../../../constants'
import { generateStatusFilter, generateTypeFilter } from '../../FilterMenu/filterMenu.settings'
import { handleFilterStateChange } from '../projectsJobsMotinoring.util'

const JobsMonitoringFilters = () => {
  const form = useForm()

  const statusList = useMemo(() => generateStatusFilter(false, JOBS_MONITORING_JOBS_TAB), [])

  const handleInputChange = (value, inputName) => {
    form.change(inputName, value || '')
  }

  const handleStateChange = (selectedValue, currentValue) => {
    handleFilterStateChange(selectedValue, currentValue, form, statusList)
  }

  return (
    <div>
      <div className="form-row">
        <FormInput name={PROJECT_FILTER} placeholder="Search by project name..." />
        <FormOnChange
          handler={value => handleInputChange(value, PROJECT_FILTER)}
          name={PROJECT_FILTER}
        />
      </div>
      <div className="form-row">
        <FormSelect label="Status" name="state" options={statusList} multiple />
        <FormOnChange handler={(value, some) => handleStateChange(value, some)} name="state" />
      </div>
      <div className="form-row">
        <FormSelect label="Type" name="type" options={generateTypeFilter()} />
      </div>
      <div className="form-row">
        <FormInput label="Labels" name={LABELS_FILTER} placeholder="key1,key2=value,..." />
        <FormOnChange
          handler={value => handleInputChange(value, LABELS_FILTER)}
          name={LABELS_FILTER}
        />
      </div>
    </div>
  )
}

export default JobsMonitoringFilters
