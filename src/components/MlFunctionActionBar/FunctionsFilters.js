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
import { OnChange } from 'react-final-form-listeners'
import { useForm } from 'react-final-form'
// import PropTypes from 'prop-types'

import { FormCheckBox } from 'igz-controls/components'

import { SHOW_UNTAGGED_FILTER, SHOW_UNTAGGED_ITEMS } from '../../constants'

import '../ArtifactsActionBar/artifactsFilters.scss'

const FunctionsFilters = () => {
  const form = useForm()

  const handleIter = value => {
    form.change(SHOW_UNTAGGED_ITEMS, value ? SHOW_UNTAGGED_ITEMS : '')
  }
  return (
    <div className="artifacts-filters">
      <div className="form-row">
        <FormCheckBox
          className="artifacts-filters__iter"
          label="Show untagged"
          name={SHOW_UNTAGGED_FILTER}
        />
        <OnChange name={SHOW_UNTAGGED_FILTER}>{handleIter}</OnChange>
      </div>
    </div>
  )
}

FunctionsFilters.propTypes = {
  // artifacts: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default FunctionsFilters
