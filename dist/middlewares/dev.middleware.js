'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = undefined;
exports.default = devMiddleware;

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpack3 = require('../../webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html = exports.html = '<!DOCTYPE html><html lang="en">\n<head>\n  <title>WE VOTE</title>\n  <meta name="viewport" content="width=device-width" />\n  <meta charset="UTF-8">\n  <meta name="description" content="Check your voter readiness and stayinformed to ensure you vote" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <meta name="keywords" content="vote, election, nigeria" />\n  <meta name="author" content="Team WeVote" />\n  <title>WeVote - Get Yourself Ready To Vote</title>\n  <meta property="og:url"           content="https://wevote-ng.herokuapp.com" />\n  <meta property="og:type" content="website" />\n  <meta property="og:title" content="WeVote - Be Vote Ready"/>\n  <meta property="og:description" content="Check your voter readiness andstay informed to ensure you vote" />\n  <meta property="og:image" content="https://raw.githubusercontent.com/ignatiusukwuoma/wevote-client/master/src/assets/nigeria-bgrd.jpg" />\n  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons">\n</head>\n<body>\n  <div id="vote"></div>\n  <script type="text/javascript" src="/public/assets/bundle.js"></script>\n</body>\n</html>';

function devMiddleware(app) {
  var compiler = (0, _webpack2.default)(_webpack4.default);
  app.use((0, _webpackDevMiddleware2.default)(compiler, {
    noInfo: true,
    publicPath: _webpack4.default.output.publicPath
  }));
  app.use((0, _webpackHotMiddleware2.default)(compiler));

  app.use('*', function (req, res) {
    res.set('content-type', 'text/html');
    return res.send(html);
  });
};