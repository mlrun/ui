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
  // webpackFinal: (config, { configType }) => {
  //   config.module.rules.push(
  //     {
  //       test: /\.scss$/,
  //       use: [
  //         'style-loader',
  //         'css-loader',
  //         {
  //           loader: 'sass-loader',
  //           options: {
  //             indentedSyntax: true
  //           }
  //         }
  //       ],
  //       include: path.resolve(__dirname, '../')
  //     },
  //     {
  //       test: /\.module.scss$/,
  //       use: [
  //         'style-loader',
  //         'css-loader',
  //         {
  //           loader: 'sass-loader?modules=true',
  //           options: {
  //             indentedSyntax: true
  //           }
  //         }
  //       ],
  //       include: path.resolve(__dirname, '../')
  //     }
  //   )

  //   return config
  // }
}
