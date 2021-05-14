import React from 'react'

import Input from './Input'

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
