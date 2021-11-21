import React from 'react'

import Button from './Button'

import {
  DANGER_BUTTON,
  LABEL_BUTTON,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from '../../constants'

import { ReactComponent as EyeIcon } from '../../images/eye.svg'
import { ReactComponent as CaretIcon } from '../../images/dropdown.svg'

export default {
  title: 'Example/Button',
  component: Button
}

const commonArgs = {
  disabled: false,
  tooltip: ''
}

const Template = args => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  ...commonArgs,
  label: 'Primary button',
  variant: PRIMARY_BUTTON
}

export const Secondary = Template.bind({})
Secondary.args = {
  ...commonArgs,
  label: 'Secondary button',
  variant: SECONDARY_BUTTON
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  ...commonArgs,
  label: 'Tertiary button',
  variant: TERTIARY_BUTTON
}

export const Danger = Template.bind({})
Danger.args = {
  ...commonArgs,
  label: 'Danger button',
  variant: DANGER_BUTTON
}

export const Label = Template.bind({})
Label.args = {
  ...commonArgs,
  label: 'Label button',
  variant: LABEL_BUTTON
}

export const Icon = Template.bind({})
Icon.args = {
  ...commonArgs,
  label: '',
  icon: <CaretIcon />
}

export const IconWithLabel = Template.bind({})
IconWithLabel.args = {
  ...commonArgs,
  label: 'Awesome Button',
  icon: <EyeIcon />
}
