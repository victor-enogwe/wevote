/**
 * Handle Sequelize Error
 *
 * @export
 * @param {object} error the error object
 * @param {object} res the response object
 * @returns {object} the error response
 */
export function handleSequelizeError(error, res) {
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
  const { errors: [err = `${error.parent}`] } = error;
  const { message } = err;

  return res.status(500).json({ status: 'fail', message });
}

// placeholder to avoid eslint errror
export const yea = () => true;
