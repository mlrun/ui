/*
Copyright 2022 Iguazio Systems Ltd.
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
import { Form } from 'react-final-form'

import FormTextarea from '/src/lib/components/FormTextarea/FormTextarea'

export default {
  title: 'Example/FormTextarea',
  component: FormTextarea
}

const commonArgs = {
  name: 'textArea',
  rows: 3
}

const Template = args => <Form onSubmit={() => null}>{() => <FormTextarea {...args} />}</Form>

export const Normal = Template.bind({})
Normal.args = {
  ...commonArgs,
  label: 'Normal'
}

export const withTip = Template.bind({})
withTip.args = {
  ...commonArgs,
  label: 'With Tip',
  tip: 'Tip'
}

export const withMaxLength = Template.bind({})
withMaxLength.args = {
  ...commonArgs,
  label: 'With max length',
  maxLength: 50
}
