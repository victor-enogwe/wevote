'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRequestValidity = checkRequestValidity;

var _check = require('express-validator/check');

const parseError = errors => errors.map(error => {
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
function checkRequestValidity(req, res, next) {
  const validity = (0, _check.validationResult)(req);
  return validity.isEmpty() ? next() : res.status(400).json({
    status: 'fail',
    message: parseError(validity.array())
  });
}