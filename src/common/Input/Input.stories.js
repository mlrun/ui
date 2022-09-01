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

import Input from './Input'

import { getValidationRules } from 'igz-controls/utils/validation.util'

export default {
  title: 'Example/Input',
  component: Input
}

const commonArgs = {
  floatingLabel: true
}

const Template = args => <Input {...args} />

export const Dense = Template.bind({})
Dense.args = {
  ...commonArgs,
  density: 'dense',
  label: 'Dense'
}

export const Normal = Template.bind({})
Normal.args = {
  ...commonArgs,
  density: 'normal',
  label: 'Normal'
}

export const Medium = Template.bind({})
Medium.args = {
  ...commonArgs,
  density: 'medium',
  label: 'Medium'
}

export const Chunky = Template.bind({})
Chunky.args = {
  ...commonArgs,
  density: 'chunky',
  label: 'Chunky'
}

export const DenseMandatory = Template.bind({})
DenseMandatory.args = {
  ...commonArgs,
  density: 'dense',
  label: 'Field is required',
  required: true,
  requiredText: 'Field is required'
}

export const NormalMandatory = Template.bind({})
NormalMandatory.args = {
  ...commonArgs,
  density: 'normal',
  label: 'Field is required',
  required: true,
  requiredText: 'Field is required'
}

export const MediumMandatory = Template.bind({})
MediumMandatory.args = {
  ...commonArgs,
  density: 'medium',
  label: 'Field is required',
  required: true,
  requiredText: 'Field is required'
}

export const ChunkyMandatory = Template.bind({})
ChunkyMandatory.args = {
  ...commonArgs,
  density: 'chunky',
  label: 'Field is required',
  required: true,
  requiredText: 'Field is required'
}

export const withValidationRules = Template.bind({})
withValidationRules.args = {
  ...commonArgs,
  density: 'chunky',
  invalid: true,
  label: 'Field is required',
  required: true,
  requiredText: 'Field is required',
  validationRules: getValidationRules('common.name'),
  value: ' test#2!'
}

export const withStaticLink = Template.bind({})
withStaticLink.args = {
  ...commonArgs,
  label: 'label with static link',
  link: {
    show: true,
    url: 'https:github.com'
  },
  value: 'test'
}

export const withDynamicLink = Template.bind({})
const value = 'some text'
withDynamicLink.args = {
  ...commonArgs,
  label: 'label with dynamic link',
  link: {
    show: value,
    url: value
  },
  value
}
