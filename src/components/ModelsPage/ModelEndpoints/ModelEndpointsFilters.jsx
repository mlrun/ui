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
import React from 'react'
import { useForm } from 'react-final-form'

import { FormInput, FormOnChange, FormSelect } from 'igz-controls/components'

import { modelEndpointsModesList } from '../../FilterMenu/filterMenu.settings'
import { LABELS_FILTER, ME_MODE_FILTER } from '../../../constants'

const ModelEndpointsFilters = () => {
  const form = useForm()

  const handleLabelsChange = value => {
    form.change(LABELS_FILTER, value || '')
  }

  return (
    <div>
      <div className="form-row">
        <FormSelect label="Mode" name={ME_MODE_FILTER} options={modelEndpointsModesList} />
      </div>
      <div className="form-row">
        <FormInput
          label="Labels"
          name={LABELS_FILTER}
          placeholder="key1,key2=value,..."
          tip="Add ~ before the filter value to return substring and case insensitive value."
        />
        <FormOnChange name={LABELS_FILTER} handler={handleLabelsChange} />
      </div>
    </div>
  )
}

export default ModelEndpointsFilters
