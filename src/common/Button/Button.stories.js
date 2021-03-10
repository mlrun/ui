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
  variant: 'primary'
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Button',
  variant: 'secondary'
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  label: 'Button',
  variant: 'tertiary'
}

export const Danger = Template.bind({})
Danger.args = {
  label: 'Button',
  variant: 'danger'
}

export const Label = Template.bind({})
Label.args = {
  label: 'Button',
  variant: 'label'
}
