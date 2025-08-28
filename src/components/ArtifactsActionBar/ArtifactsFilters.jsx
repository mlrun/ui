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
import PropTypes from 'prop-types'

import { FormInput, FormCheckBox, FormOnChange } from 'igz-controls/components'
import FormTagFilter from '../../common/FormTagFilter/FormTagFilter'

import {
  ITERATIONS_FILTER,
  LABELS_FILTER,
  MODEL_NAME_FILTER,
  MODEL_TAG_FILTER,
  SHOW_ITERATIONS,
  TAG_FILTER
} from '../../constants'

import SearchIcon from 'igz-controls/images/search.svg?react'

import './artifactsFilters.scss'

const ArtifactsFilters = ({ artifacts, filtersConfig, isAllVersions }) => {
  const form = useForm()
  const [modelName, setModelName] = useState(form.getState().values[MODEL_NAME_FILTER] || '')

  const handleIter = value => {
    form.change(ITERATIONS_FILTER, value ? SHOW_ITERATIONS : '')
  }

  const handleInputChange = (value, filterName) => {
    form.change(filterName, value || '')
  }

  const handleModelNameChange = value => {
    form.change(MODEL_NAME_FILTER, value || '')
    setModelName(value)

    if (value.length === 0) {
      form.change(MODEL_TAG_FILTER, '')
    }
  }

  return (
    <div className="artifacts-filters">
      <div className="form-row">
        <FormInput
          label={filtersConfig[LABELS_FILTER].label}
          name={LABELS_FILTER}
          placeholder="key1,key2=value,..."
          tip="Add ~ before the filter value to return substring and case insensitive value."
        />
        <FormOnChange
          name={LABELS_FILTER}
          handler={value => handleInputChange(value, LABELS_FILTER)}
        />
      </div>
      <div className="form-row">
        <FormTagFilter
          content={artifacts}
          label={filtersConfig[TAG_FILTER].label}
          name={TAG_FILTER}
          onlyLatestByDefault={!isAllVersions}
        />
      </div>
      {filtersConfig[MODEL_NAME_FILTER] && (
        <>
          <div className="form-row">
            <FormInput
              label={filtersConfig[MODEL_NAME_FILTER].label}
              inputIcon={<SearchIcon />}
              name={MODEL_NAME_FILTER}
              placeholder="Search model name.."
            />
            <FormOnChange name={MODEL_NAME_FILTER} handler={handleModelNameChange} />
          </div>
          <div className="form-row">
            <FormInput
              label={filtersConfig[MODEL_TAG_FILTER].label}
              inputIcon={modelName.length > 0 ? <SearchIcon /> : null}
              name={MODEL_TAG_FILTER}
              placeholder="All tags"
              disabled={modelName.length === 0}
              tip={modelName.length === 0 ? 'Enter a model name to enable field.' : null}
            />
            <FormOnChange
              name={MODEL_TAG_FILTER}
              handler={value => handleInputChange(value, MODEL_TAG_FILTER)}
            />
          </div>
        </>
      )}
      <div className="form-row">
        <FormCheckBox
          className="artifacts-filters__iter"
          label={filtersConfig[ITERATIONS_FILTER].label}
          name={ITERATIONS_FILTER}
        />
        <FormOnChange name={ITERATIONS_FILTER} handler={handleIter} />
      </div>
    </div>
  )
}

ArtifactsFilters.propTypes = {
  artifacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  filtersConfig: PropTypes.object.isRequired,
  isAllVersions: PropTypes.bool.isRequired
}

export default ArtifactsFilters
