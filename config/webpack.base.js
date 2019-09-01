const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [ './src/app.js' ],

  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },

  resolve: {
    extensions: ['.jsx', '.js']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'css-loader'
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
