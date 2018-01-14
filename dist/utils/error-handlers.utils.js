'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSequelizeError = handleSequelizeError;
/**
 * Handle Sequelize Error
 *
 * @export
 * @param {object} error the error object
 * @param {object} res the response object
 * @returns {object} the error response
 */
function handleSequelizeError(error, res) {
  if (!error.errors) {
    const {
      original = {
        sql: '',
        length: '',
        position: '',
        parent: 'debug error',
        file: '',
        line: '',
        routine: ''
      }
    } = error;
    const {
      sql, length, position, file, line, routine, ...err
    } = original;
    error.errors = [err];
  }
  const { errors: [message = `${error.parent}`] } = error;

  return res.status(500).json({ status: 'fail', message });
}

// placeholder to avoid eslint errror
const yea = exports.yea = () => true;