import React from 'react'

import CodeBlock from './CodeBlock'

export default {
  title: 'Example/CodeBlock',
  component: CodeBlock
}

const commonArgs = {}

const Template = args => <CodeBlock {...args} />

export const JsonCodeBlock = Template.bind({})
JsonCodeBlock.args = {
  ...commonArgs,
  label: 'Arguments',
  language: 'json',
  codeData: {
    key: 'value'
  }
}
