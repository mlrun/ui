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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SplitButton from '../SplitButton/SplitButton'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/back-arrow.svg'

import './sort.scss'

const Sort = ({
  disabled = false,
  isDescendingOrder,
  onSelectOption,
  options,
  selectedId,
  setIsDescendingOrder
}) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const arrowDirectionClassName = classNames(
    'sort-icon',
    isDescendingOrder ? 'sort-icon_down' : 'sort-icon_up'
  )

  useEffect(() => {
    setSelectedOption(options.find(option => option.id === selectedId))
  }, [options, selectedId])

  return (
    <div className="sort">
      <SplitButton
        disabled={disabled}
        mainButton={{
          icon: <ArrowIcon className={arrowDirectionClassName} />,
          label: selectedOption?.label ?? 'Sort',
          onClick: () => setIsDescendingOrder(state => !state)
        }}
        additionalButton={{
          label: '',
          onSelectOption,
          options,
          selectedOption
        }}
      />
    </div>
  )
}

Sort.propTypes = {
  disabled: PropTypes.bool,
  isDescendingOrder: PropTypes.bool.isRequired,
  onSelectOption: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectedId: PropTypes.string.isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired
}

export default Sort
