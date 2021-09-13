import React from 'react'

import LoadButton from './LoadButton'

import { PRIMARY_BUTTON, SECONDARY_BUTTON, TERTIARY_BUTTON } from '../../constants'

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
  variant: PRIMARY_BUTTON
}

export const SecondaryLoader = Template.bind({})
SecondaryLoader.args = {
  ...commonArgs,
  label: 'Secondary loader',
  variant: SECONDARY_BUTTON
}

export const TertiaryLoader = Template.bind({})
TertiaryLoader.args = {
  ...commonArgs,
  label: 'Tertiary loader',
  variant: TERTIARY_BUTTON
}
