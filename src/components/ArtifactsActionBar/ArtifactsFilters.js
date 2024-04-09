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
import PropTypes from 'prop-types'

import { FormInput, FormCheckBox } from 'igz-controls/components'
import FormTagFilter from '../../common/FormTagFilter/FormTagFilter'
import FormOnChange from '../../common/FormOnChange/FormOnChange'

import { ITERATIONS_FILTER, LABELS_FILTER, SHOW_ITERATIONS, TAG_FILTER } from '../../constants'

import './artifactsFilters.scss'

const ArtifactsFilters = ({ artifacts }) => {
  const form = useForm()

  const handleIter = value => {
    form.change(ITERATIONS_FILTER, value ? SHOW_ITERATIONS : '')
  }

  const handleLabelsChange = value => {
    form.change(LABELS_FILTER, value || '')
  }

  return (
    <div className="artifacts-filters">
      <div className="form-row">
        <FormInput label="Labels" name={LABELS_FILTER} placeholder="key1,key2=value,..." />
        <FormOnChange name={LABELS_FILTER}  handler={handleLabelsChange}/>
      </div>
      <div className="form-row">
        <FormTagFilter content={artifacts} label="Version tag" name={TAG_FILTER} />
      </div>
      <div className="form-row">
        <FormCheckBox
          className="artifacts-filters__iter"
          label="Show best iteration only"
          name={ITERATIONS_FILTER}
        />
        <FormOnChange name={ITERATIONS_FILTER} handler={handleIter}/>
      </div>
    </div>
  )
}

ArtifactsFilters.propTypes = {
  artifacts: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ArtifactsFilters
