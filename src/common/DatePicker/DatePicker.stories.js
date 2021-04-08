import React from 'react'

import '../Input/input.scss'
import DatePicker from './DatePicker'

export default {
  title: 'Example/DatePicker',
  component: DatePicker
}

const commonArgs = {
  label: 'Date: ',
  splitCharacter: '/'
}

const Template = args => <DatePicker {...args} />

export const Date = Template.bind({})
Date.args = {
  ...commonArgs,
  type: 'date'
}

export const DateRange = Template.bind({})
DateRange.args = {
  ...commonArgs,
  type: 'date-range'
}

export const DateTime = Template.bind({})
DateTime.args = {
  ...commonArgs,
  type: 'date-time'
}

export const DateRangeTime = Template.bind({})
DateRangeTime.args = {
  ...commonArgs,
  type: 'date-range-time'
}
