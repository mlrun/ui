import React from 'react'

import Input from './Input'

import { getValidationRules } from 'igz-controls/utils/validationService'

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
