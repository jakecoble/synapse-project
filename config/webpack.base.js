const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [ 'react-hot-loader/patch', './src/app.js' ],

  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },

  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.(scss|sass|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
