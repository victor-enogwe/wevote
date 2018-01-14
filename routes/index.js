import fs from 'fs';

const routes = {};
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const route = require(`./${file}`).default;
    routes[file.split(/\./)[0]] = route;
  });

export default routes;
