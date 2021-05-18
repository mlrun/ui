import React from 'react'

import RangeInput from './RangeInput'

export default {
  title: 'Example/RangeInput',
  component: RangeInput
}

const commonArgs = {
  floatingLabel: true,
  max: 10,
  min: 0,
  value: ''
}

const Template = args => <RangeInput {...args} />

export const Dense = Template.bind({})
Dense.args = {
  ...commonArgs,
  density: 'dense',
  label: 'Dense label'
}

export const Normal = Template.bind({})
Normal.args = {
  ...commonArgs,
  density: 'normal',
  label: 'Normal label'
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
