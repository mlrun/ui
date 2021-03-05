import React from 'react'

import { Button } from './Button'

export default {
  title: 'Example/Button',
  component: Button
}

const Template = args => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  type: 'primary',
  label: 'Button'
}

export const Secondary = Template.bind({})
Secondary.args = {
  type: 'secondary',
  label: 'Button'
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  type: 'tertiary',
  label: 'Button'
}

export const Danger = Template.bind({})
Danger.args = {
  type: 'danger',
  label: 'Button'
}

export const Label = Template.bind({})
Label.args = {
  type: 'label',
  label: 'Button'
}
