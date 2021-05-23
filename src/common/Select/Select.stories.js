import React from 'react'

import Select from './Select'

export default {
  title: 'Example/Select',
  component: Select
}

const commonArgs = {
  options: [
    { id: 'min', label: 'long-long-long-long-long-long-long-long' },
    { id: 'max', label: 'Max' }
  ],
  label: 'label',
  selectedId: 'min',
  floatingLabel: false
}

const Template = args => <Select {...args} />

export const Dense = Template.bind({})
Dense.args = {
  ...commonArgs,
  density: 'dense'
}

export const Normal = Template.bind({})
Normal.args = {
  ...commonArgs,
  density: 'normal'
}

export const Medium = Template.bind({})
Medium.args = {
  ...commonArgs,
  density: 'medium'
}

export const Chunky = Template.bind({})
Chunky.args = {
  ...commonArgs,
  density: 'chunky'
}
