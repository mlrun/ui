import React from 'react'

import '../scss/main.scss'

export default {
  title: 'Example/Link'
}

const Link = args => <a className="link">{args.label}</a>

export const Sample = Link.bind({})
Sample.args = {
  label: 'https://www.git.com/thisisalie0921e...'
}
