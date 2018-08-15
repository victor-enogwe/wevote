const env = require('dotenv')
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

env.config()
const { NODE_ENV, HOST_NAME, WS_HOST_NAME, MAPS_KEY } = process.env
const isDevMode = NODE_ENV === 'development'

const config = {
  mode: NODE_ENV,
  devtool: 'source-map',
  entry: './client/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: '[name].bundle.js',
    // chunkFilename: '[name].bundle.js',
    publicPath: '/',
    globalObject: 'this'
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
      WS_HOST_NAME: JSON.stringify(`${WS_HOST_NAME}`),
      NODE_ENV: JSON.stringify(`${NODE_ENV}`),
      MAPS_KEY: JSON.stringify(`${MAPS_KEY}`)
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new UglifyJsPlugin({
      sourceMap: false,
      uglifyOptions: { mangle: true, compress: true }
    }),
    new HtmlWebpackPlugin({
      title: 'We Vote',
      filename: 'index.html',
      template: './client/index.html',
      favicon: './favicon.ico',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        keywords: 'vote, election, nigeria',
        author: 'Team WeVote',
        'og:url': 'https://wevote-ng.herokuapp.com',
        'og:type': 'website',
        'og:title': 'WeVote - Be Vote Ready',
        'og:description': 'Be Vote Ready Today'
      },
      minify: !isDevMode,
      showErrors: isDevMode,
      alwaysWriteToDisk: true
      // cache: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ],
  resolve: { extensions: ['.js', '.jsx'] },
  optimization: {
    splitChunks: {
      automaticNameDelimiter: '-',
      cacheGroups: {
        commons: {
          maxInitialRequests: 5,
          minChunks: 5,
          chunks: 'initial'
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    runtimeChunk: true
  }
}

if (isDevMode) {
  config.entry = [
    config.entry,
    'webpack-hot-middleware/client?reload=true&quiet=true'
  ]
  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    ...config.plugins,
    new BundleAnalyzerPlugin()
  ]
}

module.exports = config
