import webpackDev from 'webpack-dev-middleware'
import webpackHot from 'webpack-hot-middleware'
import webpack from 'webpack'
import webpackConfig from '../../webpack.config'

/**
 * Webpack Dev Middleware
 *
 * @export
 * @param {Object} app express app
 * @param {Boolean} isDevMode app in development
 * @returns {Function} function webpack dev middleware
 */
export default function devMiddleware (app, isDevMode) {
  if (isDevMode) {
    const compiler = webpack(webpackConfig)

    return app.use(webpackDev(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath
    }), webpackHot(compiler))
  }
}
