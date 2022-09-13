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
