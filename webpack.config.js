const env = require('dotenv')
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

env.config()
const { NODE_ENV, HOST_NAME } = process.env
const isDevMode = NODE_ENV === 'development'

const config = {
  mode: NODE_ENV,
  devtool: 'source-map',
  entry: './client/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/public/assets'),
    publicPath: '/public/assets/'
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/, /dist/, /server/],
        include: path.join(__dirname, 'client'),
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.s*css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|png|svg|gif|ico)$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(`${HOST_NAME}/api/v1/`),
      HOST_NAME: JSON.stringify(`${HOST_NAME}`),
      NODE_ENV: JSON.stringify(`${NODE_ENV}`)
    }),
    new HtmlWebpackPlugin({
      title: 'FCC PINTEREST',
      template: './server/public/index.html',
      filename: path.resolve(__dirname, 'dist/public/index.html')
    })
  ],

  resolve: { extensions: ['.js', '.jsx'] }
}

if (isDevMode) {
  config.entry = [
    config.entry,
    'webpack-hot-middleware/client?reload=true&quiet=true'
  ]
  config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin()
    // new BundleAnalyzerPlugin()
  ]
}

module.exports = config
