import React from 'react'

import SplitButton from './SplitButton'

import { ReactComponent as EyeIcon } from '../../images/eye.svg'

export default {
  title: 'Example/SplitButton',
  component: SplitButton
}

const commonArgs = {
  additionalButton: {
    options: [
      { id: 'min', label: 'long-long-long-long-long-long-long-long' },
      { id: 'max', label: 'Max' }
    ],
    selectedOption: { id: 'max', label: 'Max' }
  }
}

const Template = args => <SplitButton {...args} />

export const Noraml = Template.bind({})
Noraml.args = {
  ...commonArgs,
  additionalButton: {
    ...commonArgs['additionalButton'],
    label: ''
  }
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  mainButton: {
    ...commonArgs['mainButton'],
    icon: <EyeIcon />,
    variant: 'primary'
  },
  additionalButton: {
    ...commonArgs['additionalButton'],
    label: '',
    variant: 'primary'
  }
}
