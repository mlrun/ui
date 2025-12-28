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
import PropTypes from 'prop-types'
import { useMemo, useEffect, useRef } from 'react'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import { generateTimeOptions, is12HourFormat } from './TimePicker.utils'

function TimePickerOptions({ handleInputChange = () => {} }) {
  const beginningOptionRef = useRef()
  const timeOptions = useMemo(() => generateTimeOptions(is12HourFormat()), [])

  const scrollTargetIndex = useMemo(() => {
    return timeOptions.findIndex(option => option.includes('06:00'))
  }, [timeOptions])

  useEffect(() => {
    // per figma show list from 06:00 AM
    if (beginningOptionRef.current) {
      beginningOptionRef.current.scrollIntoView()
    }
  }, [])

  return (
    <>
      {timeOptions.map((option, index) => {
        const isScrollTarget = index === scrollTargetIndex

        return (
          <div
            key={option}
            className={'time-picker__dropdown-item'}
            onClick={() => handleInputChange(option)}
            ref={isScrollTarget ? beginningOptionRef : null}
          >
            <Tooltip template={<TextTooltipTemplate text={option} />}>
              <span>{option}</span>
            </Tooltip>
          </div>
        )
      })}
    </>
  )
}

TimePickerOptions.propTypes = {
  handleInputChange: PropTypes.func
}

export default TimePickerOptions
