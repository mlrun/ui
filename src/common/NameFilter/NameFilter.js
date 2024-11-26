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
import PropTypes from 'prop-types'
import { useField } from 'react-final-form'

import { FormInput } from 'igz-controls/components'

import { KEY_CODES, NAME_FILTER } from '../../constants'

import { ReactComponent as SearchIcon } from 'igz-controls/images/search.svg'

import './nameFilter.scss'

const NameFilter = ({ applyChanges }) => {
  const { input } = useField(NAME_FILTER)

  const handleNameChange = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      applyChanges(event.target.value)
    }
  }
  const handleIconClick = () => {
    if (input.value.length > 0) {
      applyChanges(input.value)
    }
  }

  return (
    <div className="name-filter filter-column">
      <FormInput
        iconClass="name-filter__icon"
        iconClick={handleIconClick}
        inputIcon={<SearchIcon />}
        name={NAME_FILTER}
        onKeyDown={handleNameChange}
        placeholder="Search by name"
      />
    </div>
  )
}

NameFilter.propTypes = {
  applyChanges: PropTypes.func.isRequired
}

export default NameFilter
