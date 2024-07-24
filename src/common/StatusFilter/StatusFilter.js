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
import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { useField, useForm } from 'react-final-form'
import { isEmpty } from 'lodash'

import { FormOnChange, FormSelect } from 'iguazio.dashboard-react-controls/dist/components'
import { FILTER_ALL_ITEMS, STATUS_FILTER_NAME } from '../../constants'

const StatusFiler = ({ statusList, name = STATUS_FILTER_NAME }) => {
  const { input } = useField(name)
  const { change } = useForm()

  const mappedStatusList = useMemo(() => {
    const isAllStatusSelected = input.value?.includes?.(FILTER_ALL_ITEMS)
    return isAllStatusSelected
      ? statusList.map(status =>
          status.id === FILTER_ALL_ITEMS ? { ...status, disabled: true } : status
        )
      : statusList
  }, [input.value, statusList])

  const handleFilterStateChange = (selectedValue, currentValue) => {
    if (
      selectedValue.length > 1 &&
      selectedValue.includes(FILTER_ALL_ITEMS) &&
      selectedValue.indexOf(FILTER_ALL_ITEMS) === 0
    ) {
      change(
        name,
        selectedValue.filter(value => value !== FILTER_ALL_ITEMS)
      )
    } else if (
      isEmpty(selectedValue) ||
      (!currentValue.includes(FILTER_ALL_ITEMS) &&
        selectedValue.includes(FILTER_ALL_ITEMS) &&
        selectedValue.indexOf(FILTER_ALL_ITEMS) > 0) ||
      mappedStatusList.filter(option => option.id !== FILTER_ALL_ITEMS).length ===
        selectedValue.length
    ) {
      change(name, [FILTER_ALL_ITEMS])
    }
  }

  return (
    <>
      <FormSelect label="Status" name={name} options={mappedStatusList} multiple />
      <FormOnChange handler={(value, some) => handleFilterStateChange(value, some)} name={name} />
    </>
  )
}

StatusFiler.propTypes = {
  statusList: PropTypes.array.isRequired
}

export default memo(StatusFiler)
