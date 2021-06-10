import React from 'react'

import Chip from './Chip'

export default {
  title: 'Example/Chip',
  component: Chip
}

const commonArgs = {
  chip: { value: 'key: value' }
}

const Template = args => <Chip {...args} />

export const DenseChip = Template.bind({})
DenseChip.args = {
  ...commonArgs,
  density: 'dense'
}

export const NormalChip = Template.bind({})
NormalChip.args = {
  ...commonArgs,
  density: 'normal'
}

export const MediumChip = Template.bind({})
MediumChip.args = {
  ...commonArgs,
  density: 'medium'
}
