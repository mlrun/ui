import React from 'react'

import RangeInput from './RangeInput'

export default {
  title: 'Example/RangeInput',
  component: RangeInput
}

const commonArgs = {
  floatingLabel: true
}

const Template = args => <RangeInput {...args} />

export const Dense = Template.bind({})
Dense.args = {
  ...commonArgs,
  density: 'dense',
  label: 'Dense label',
  value: ''
}

export const Normal = Template.bind({})
Normal.args = {
  ...commonArgs,
  density: 'normal',
  label: 'Normal label',
  value: ''
}

export const Medium = Template.bind({})
Medium.args = {
  ...commonArgs,
  density: 'medium',
  label: 'Medium label',
  value: ''
}

export const Chunky = Template.bind({})
Chunky.args = {
  ...commonArgs,
  density: 'chunky',
  label: 'Chunky label',
  value: ''
}
