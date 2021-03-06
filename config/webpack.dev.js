const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const webpack = require('webpack')
const HtmlWebpackInjectPlugin = require('html-webpack-inject-plugin').default

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: ['webpack-hot-middleware/client'],
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackInjectPlugin({
      externals: [{
        tag: 'script',
        attrs: {
          src: 'http://localhost:8098'
        }
      }]
    })
  ]
})
