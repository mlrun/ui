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
import React, { useState } from 'react'
import { useForm } from 'react-final-form'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { FormInput, FormOnChange } from 'igz-controls/components'
import FormTagFilter from '../../common/FormTagFilter/FormTagFilter'
import { FormSelect } from 'iguazio.dashboard-react-controls/dist/components'

import { ENTITIES_FILTER, LABELS_FILTER, PROJECT_FILTER, TAG_FILTER, TAG_FILTER_LATEST } from '../../constants'
import { generateProjectsList } from '../../utils/projects'

const AddToFeatureVectorFilters = ({ content, fetchTags }) => {
  const form = useForm()
  const [tagFilterKey, setTagFilterKey] = useState('')
  const projectStore = useSelector(store => store.projectStore)
  const params = useParams()

  const handleInputChange = (value, inputName) => {
    form.change(inputName, value || '')
  }

  const handleProjectChange = (value) => {
    fetchTags(value)
    form.change(TAG_FILTER, TAG_FILTER_LATEST)
    setTagFilterKey(value)
  }

  return (
    <div>
      <div className="form-row">
        <FormSelect
          label="Project"
          name={PROJECT_FILTER}
          options={generateProjectsList(projectStore.projectsNames.data, params.projectName)}
          preventWidthOverflow
        />
        <FormOnChange name={PROJECT_FILTER} handler={handleProjectChange} />
      </div>      
      <div className="form-row">
        <FormInput label="Entity" name={ENTITIES_FILTER} placeholder="Search by entity" />
        <FormOnChange name={ENTITIES_FILTER} handler={value => handleInputChange(value, ENTITIES_FILTER)} />
      </div>
      <div className="form-row">
        <FormInput
          label="Labels"
          name={LABELS_FILTER}
          placeholder="key1,key2=value,..."
          tip="Add ~ before the filter value to return substring and case insensitive value."
        />
        <FormOnChange name={LABELS_FILTER} handler={value => handleInputChange(value, LABELS_FILTER)} />
      </div>
      <div className="form-row">
        <FormTagFilter content={content} label="Version tag" name={TAG_FILTER} key={tagFilterKey} />
      </div>
    </div>
  )
}

AddToFeatureVectorFilters.propTypes = {
  content: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchTags: PropTypes.func.isRequired
}

export default AddToFeatureVectorFilters
