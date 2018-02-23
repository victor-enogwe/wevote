import { validationResult } from 'express-validator/check';

const parseError = errors => errors
  .map((error) => {
    const {
      location, param, value, msg
    } = error;
    return `${location} param '${param}'(${value}) is invalid. help(${msg})`;
  });

/**
 * Checks for validation errors
 * runs after the main validations have been made
 *
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next the callback function
 *
 * @returns {Object} the response containing current btc price
 */
export function checkRequestValidity(req, res, next) {
  const userData = req.body;
  const data = {};
  for (const d in userData) {
    if (userData[d] !== '') {
      data[d] = userData[d];
    }
  }
  req.body = data
  const validity = validationResult(req);
  return validity.isEmpty() ? next() : res.status(400).json({
    status: 'fail',
    message: parseError(validity.array())
  });
}
