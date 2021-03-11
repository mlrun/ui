import React from 'react'

import Button from './Button'

export default {
  title: 'Example/Button',
  component: Button
}

const commonArgs = {
  disabled: false
}

const Template = args => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  ...commonArgs,
  label: 'Primary button',
  variant: 'primary'
}

export const Secondary = Template.bind({})
Secondary.args = {
  ...commonArgs,
  label: 'Secondary button',
  variant: 'secondary'
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  ...commonArgs,
  label: 'Tertiary button',
  variant: 'tertiary'
}

export const Danger = Template.bind({})
Danger.args = {
  ...commonArgs,
  label: 'Danger button',
  variant: 'danger'
}

export const Label = Template.bind({})
Label.args = {
  ...commonArgs,
  label: 'Label button',
  variant: 'label'
}
