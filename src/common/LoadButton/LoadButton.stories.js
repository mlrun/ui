import React from 'react'

import LoadButton from './LoadButton'

export default {
  title: 'Example/LoadButton',
  component: LoadButton
}

const Template = args => <LoadButton {...args} />

export const PrimaryLoader = Template.bind({})
PrimaryLoader.args = {
  label: 'Button',
  variant: 'primary'
}

export const SecondaryLoader = Template.bind({})
SecondaryLoader.args = {
  label: 'Button',
  variant: 'secondary'
}

export const TertiaryLoader = Template.bind({})
TertiaryLoader.args = {
  label: 'Button',
  variant: 'tertiary'
}
