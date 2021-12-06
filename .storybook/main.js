const path = require('path')

module.exports = {
  babel: async options => {
    options.plugins.push('babel-plugin-inline-react-svg')
    return options
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-scss'
  ]
}
