import webpackDev from 'webpack-dev-middleware'
import webpackHot from 'webpack-hot-middleware'
import webpack from 'webpack'
import webpackConfig from '../../webpack.config'

export default function devMiddleware (app) {
  const compiler = webpack(webpackConfig)
  app.use(webpackDev(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(webpackHot(compiler))

  app.use('*', (req, res) => {
    res.set('content-type', 'text/html')
    return res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>WE VOTE</title>
        <meta name="viewport" content="width=device-width" />
        <meta charset="UTF-8">
        <meta name="description" content="Check your voter readiness and stay\
informed to ensure you vote" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="vote, election, nigeria" />
        <meta name="author" content="Team WeVote" />
        <title>WeVote - Get Yourself Ready To Vote</title>
        <meta property="og:url"           content="https://wevote-ng.herokuapp.\
com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="WeVote - Be Vote Ready"/>
        <meta property="og:description" content="Check your voter readiness and\
 stay informed to ensure you vote" />
        <meta property="og:image" content="https://raw.githubusercontent.com/ig\
natiusukwuoma/wevote-client/master/src/assets/nigeria-bgrd.jpg" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=\
Roboto:300,400,500|Material+Icons">
      </head>
      <body>
        <div id="vote"></div>
        <script type="text/javascript" src="/public/assets/bundle.js"></script>
      </body>
    </html>
    `)
  })
};
