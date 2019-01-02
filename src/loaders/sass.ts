import { paths } from '../shared'

export const sassLoader = (loader = {
  loader: 'sass-loader',
  options: {
    includePaths: [paths.node_modules],
    implementation: require('node-sass'),
    syntax: ['sass']
  }
}) => loader