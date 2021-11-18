import React from 'react'

import SplitButton from './SplitButton'

import { ReactComponent as EyeIcon } from '../../images/eye.svg'

export default {
  title: 'Example/SplitButton',
  component: SplitButton
}

const commonArgs = {
  mainButton: {
    label: 'Test',
    onclick: () => {}
  },
  additionalButton: {
    options: [
      { id: 'min', label: 'long-long-long-long-long-long-long-long' },
      { id: 'max', label: 'Max' }
    ],
    onSelectOption: () => {},
    selectedOption: ''
  }
}

const Template = args => <SplitButton {...args} />

export const Noraml = Template.bind({})
Noraml.args = {
  ...commonArgs
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  ...commonArgs,
  mainButton: {
    ...commonArgs['mainButton'],
    icon: EyeIcon,
    variant: 'primary'
  },
  additionalButton: {
    ...commonArgs['additionalButton'],
    variant: 'primary'
  }
}
