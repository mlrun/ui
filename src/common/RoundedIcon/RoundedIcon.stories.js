import React from 'react'

import RoundedIcon from './RoundedIcon'

import { ReactComponent as RefreshIcon } from '../../images/refresh.svg'

export default {
  title: 'Example/RoundedIcon',
  component: RoundedIcon
}

const commonArgs = {
  children: <RefreshIcon />
}

const Template = args => <RoundedIcon {...args} />

export const Normal = Template.bind({})
Normal.args = {
  ...commonArgs
}

export const WithToolTip = Template.bind({})
WithToolTip.args = {
  ...commonArgs,
  tooltipText: 'Test Text'
}
