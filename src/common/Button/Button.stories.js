import React from 'react'

import Button from './Button'

export default {
  title: 'Example/Button',
  component: Button
}

const Template = args => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: 'Button',
  type: 'primary'
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Button',
  type: 'secondary'
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  label: 'Button',
  type: 'tertiary'
}

export const Danger = Template.bind({})
Danger.args = {
  label: 'Button',
  type: 'danger'
}

export const Label = Template.bind({})
Label.args = {
  label: 'Button',
  type: 'label'
}
