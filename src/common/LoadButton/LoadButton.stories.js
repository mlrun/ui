import React from 'react'

import { LoadButton } from './LoadButton.js'

export default {
  title: 'Example/LoadButton',
  component: LoadButton
}

const Template = args => <LoadButton {...args} />

export const PrimaryLoader = Template.bind({})
PrimaryLoader.args = {
  type: 'load-primary',
  label: 'Button'
}

export const SecondaryLoader = Template.bind({})
SecondaryLoader.args = {
  type: 'load-secondary',
  label: 'Button Al',
  onClick: () => console.log('works')
}

export const TertiaryLoader = Template.bind({})
TertiaryLoader.args = {
  type: 'load-tertiary',
  label: 'Button Al'
}
