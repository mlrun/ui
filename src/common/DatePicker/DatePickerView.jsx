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
import MaskedInput from 'react-text-mask'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import TimePicker from '../TimePicker/TimePicker'
import {
  Button,
  Tip,
  Tooltip,
  TextTooltipTemplate,
  PopUpDialog,
  ErrorMessage
} from 'igz-controls/components'
import { SelectOption } from 'igz-controls/elements'

import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { CUSTOM_RANGE_DATE_OPTION } from '../../utils/datePicker.util'
import { DATE_PICKER_TIME_FRAME_LIMITS } from '../../types'

import Arrow from 'igz-controls/images/arrow.svg?react'
import CaretIcon from 'igz-controls/images/dropdown.svg?react'
import ExclamationMarkIcon from 'igz-controls/images/exclamation-mark.svg?react'

import './datePicker.scss'

const DatePickerView = React.forwardRef(
  (
    {
      autoCorrectedDatePipe,
      className,
      config,
      dateMask,
      datePickerInputOnBlur,
      datePickerOptions,
      disabled,
      externalInvalidMessage,
      getInputValueValidity,
      invalidMessage,
      isDatePickerOpened,
      isDatePickerOptionsOpened,
      isInputInvalid,
      isRange,
      isRangeDateValid,
      isSameDate,
      isTime,
      isTimeRangeNegative,
      isValueEmpty,
      label,
      months,
      onApplyChanges,
      onInputChange,
      onInputClick,
      onNextMonth,
      onPreviousMonth,
      onSelectOption,
      onTimeChange,
      required,
      requiredText,
      selectedOption = null,
      setSelectedDate,
      timeFrameLimit,
      tip,
      valueDatePickerInput,
      weekDay,
      withLabels
    },
    ref
  ) => {
    const datePickerClassNames = classnames(
      'date-picker-container',
      className,
      withLabels && 'date-picker-container__with-labels',
      selectedOption?.id === CUSTOM_RANGE_DATE_OPTION && 'date-picker-container__custom-range'
    )
    const inputClassNames = classnames(
      'input',
      !isRange && 'input-short',
      'date-picker__input',
      'active-input',
      isRange && 'long-input',
      isValueEmpty && 'date-picker__input_empty',
      disabled && 'date-picker__input_disabled',
      isInputInvalid && 'input_invalid'
    )
    const inputLabelClassNames = classnames('input__label', label && 'active-label')

    return (
      <div
        data-testid="date-picker-container"
        className={datePickerClassNames}
        ref={ref.datePickerRef}
      >
        <div
          data-testid="date-picker-input"
          className="date-picker__input-wrapper input-wrapper"
          onClick={onInputClick}
        >
          {withLabels && selectedOption && selectedOption.id !== CUSTOM_RANGE_DATE_OPTION ? (
            <>
              <span>{selectedOption.label}</span>
              <i className="date-picker__caret">
                <CaretIcon />
              </i>
            </>
          ) : (
            <>
              <MaskedInput
                className={inputClassNames}
                keepCharPositions={true}
                mask={dateMask}
                disabled={disabled}
                readOnly={isValueEmpty}
                showMask={!isValueEmpty}
                onBlur={datePickerInputOnBlur}
                onChange={onInputChange}
                pipe={autoCorrectedDatePipe}
                value={valueDatePickerInput}
              />
              {isValueEmpty && timeFrameLimit === Infinity && (
                <span className="input__label input__label-empty">&nbsp;Any time</span>
              )}
            </>
          )}
          <span className={inputLabelClassNames}>
            {label}
            {required && <span className="input__label-mandatory"> *</span>}
          </span>
          {isInputInvalid && (
            <Tooltip
              className="input__warning"
              template={
                <TextTooltipTemplate
                  text={
                    required && getInputValueValidity(valueDatePickerInput)
                      ? requiredText
                      : invalidMessage || externalInvalidMessage
                  }
                  warning
                />
              }
            >
              <ExclamationMarkIcon />
            </Tooltip>
          )}
        </div>
        {isDatePickerOptionsOpened && (
          <PopUpDialog
            className="date-picker__pop-up-wrapper"
            headerIsHidden
            customPosition={{
              element: ref.datePickerRef,
              position: 'bottom-right',
              autoHorizontalPosition: true
            }}
          >
            <div ref={ref.datePickerViewRef} className="date-picker__pop-up">
              {datePickerOptions.map(option => (
                <SelectOption
                  item={option}
                  name={option.id}
                  key={option.id}
                  onClick={() => {
                    onSelectOption(option)
                  }}
                  withSelectedIcon
                  selectedId={selectedOption && selectedOption.id}
                />
              ))}
            </div>
          </PopUpDialog>
        )}
        {isDatePickerOpened && (
          <PopUpDialog
            className="date-picker__pop-up-wrapper"
            headerIsHidden
            customPosition={{
              element: ref.datePickerRef,
              position: 'bottom-right',
              autoVerticalPosition: true,
              autoHorizontalPosition: true
            }}
          >
            <div ref={ref.datePickerViewRef} className="date-picker__pop-up date-picker">
              <div className="date-picker__calendars">
                {config.map(item => (
                  <div className={classnames('date-picker__calendar')} key={item.id}>
                    <div className="date-picker__header">
                      <Arrow
                        data-testid="btn-previous-month"
                        className="date-picker__header-previous-month"
                        onClick={() => onPreviousMonth(item.id)}
                      />
                      {isRange && <span className="date-picker__header-label">{item.label}</span>}
                      <div>
                        <span className="date-picker__header-month">
                          {months[item.visibleDate.getMonth()]}
                        </span>
                        <span className="date-picker__header-year">
                          {item.visibleDate.getFullYear()}
                        </span>
                      </div>
                      <Arrow
                        data-testid="btn-next-month"
                        className="date-picker__header-next-month"
                        onClick={() => onNextMonth(item.id)}
                      />
                    </div>
                    <div className="date-picker__weeks">
                      {weekDay.map((day, index) => {
                        return (
                          <div key={`${day}${index}`} className="date-picker__weeks-day">
                            {day.label}
                          </div>
                        )
                      })}
                    </div>
                    {item.calendar.map(({ week }, index) => (
                      <div key={`${week[0].day.getMonth()}${index}`} className="date-picker__week">
                        {week.map(({ day }) => (
                          <div
                            key={`${day.getMonth()}${day.getDate()}${day.getFullYear()}`}
                            className={classnames(
                              'date-picker__week-day-wrapper',
                              item.id === 'configFrom' ? 'calendar-from' : 'calendar-to',
                              item.visibleDate.getMonth() === day.getMonth()
                                ? 'current-month'
                                : 'not-current-month',
                              isSameDate(config[0].selectedDate, day) && 'selected-from',
                              isRange && isSameDate(config[1].selectedDate, day) && 'selected-to',
                              isRangeDateValid(day) && 'in-range',
                              isTimeRangeNegative && 'negative-range'
                            )}
                            onClick={() => {
                              item.visibleDate.getMonth() === day.getMonth() &&
                                setSelectedDate(item.id, day, item.selectedDate)
                            }}
                          >
                            <div className="date-picker__week-day">{day.getDate()}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                    {isTime && (
                      <div className="date-picker__time">
                        <TimePicker
                          onChange={time => onTimeChange(item.id, time, item.selectedDate)}
                          value={`${String(item.selectedDate.getHours()).padStart(2, '0')}:${String(
                            item.selectedDate.getMinutes()
                          ).padStart(2, '0')}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div
                className={classnames(
                  'date-picker__footer',
                  isRange && 'date-picker__footer-range'
                )}
              >
                {!isEmpty(invalidMessage) && <ErrorMessage message={invalidMessage} />}
                <Button
                  variant={PRIMARY_BUTTON}
                  label="Apply"
                  onClick={onApplyChanges}
                  className="date-picker__apply-btn"
                  disabled={!isEmpty(invalidMessage)}
                />
              </div>
            </div>
          </PopUpDialog>
        )}
        {tip && <Tip text={tip} className="input__tip" />}
      </div>
    )
  }
)

DatePickerView.displayName = 'DatePickerView'

DatePickerView.propTypes = {
  autoCorrectedDatePipe: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  config: PropTypes.arrayOf(PropTypes.object).isRequired,
  dateMask: PropTypes.array.isRequired,
  datePickerInputOnBlur: PropTypes.func.isRequired,
  datePickerOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool.isRequired,
  externalInvalidMessage: PropTypes.string.isRequired,
  getInputValueValidity: PropTypes.func.isRequired,
  floatingLabel: PropTypes.bool,
  invalidMessage: PropTypes.string.isRequired,
  isDatePickerOpened: PropTypes.bool.isRequired,
  isDatePickerOptionsOpened: PropTypes.bool.isRequired,
  isInputInvalid: PropTypes.bool.isRequired,
  isRange: PropTypes.bool.isRequired,
  isRangeDateValid: PropTypes.func.isRequired,
  isSameDate: PropTypes.func.isRequired,
  isTime: PropTypes.bool.isRequired,
  isTimeRangeNegative: PropTypes.bool.isRequired,
  isValueEmpty: PropTypes.bool.isRequired,
  label: PropTypes.string,
  months: PropTypes.array.isRequired,
  onApplyChanges: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onInputClick: PropTypes.func.isRequired,
  onNextMonth: PropTypes.func.isRequired,
  onPreviousMonth: PropTypes.func.isRequired,
  onSelectOption: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  requiredText: PropTypes.string.isRequired,
  selectedOption: PropTypes.object,
  setSelectedDate: PropTypes.func.isRequired,
  timeFrameLimit: DATE_PICKER_TIME_FRAME_LIMITS,
  tip: PropTypes.string.isRequired,
  valueDatePickerInput: PropTypes.string.isRequired,
  weekDay: PropTypes.array.isRequired,
  withLabels: PropTypes.bool.isRequired
}

export default React.memo(DatePickerView)
