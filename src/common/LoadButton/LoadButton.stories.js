import React from 'react'

import LoadButton from './LoadButton'

export default {
  title: 'Example/LoadButton',
  component: LoadButton
}

const commonArgs = {
  disabled: false
}

const Template = args => <LoadButton {...args} />

export const PrimaryLoader = Template.bind({})
PrimaryLoader.args = {
  ...commonArgs,
  label: 'Primary loader',
  variant: 'primary'
}

export const SecondaryLoader = Template.bind({})
SecondaryLoader.args = {
  ...commonArgs,
  label: 'Secondary loader',
  variant: 'secondary'
}

export const TertiaryLoader = Template.bind({})
TertiaryLoader.args = {
  ...commonArgs,
  label: 'Tertiary loader',
  variant: 'tertiary'
}
