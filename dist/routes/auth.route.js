'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _check = require('express-validator/check');

var _validators = require('../middlewares/validators.middleware');

var _auth = require('../controllers/v1/auth.controller');

const authRoutes = (0, _express.Router)();

authRoutes.post('/basic', (0, _check.body)('email').isEmail(), (0, _check.body)('password', 'min of 8 chars').isLength({ min: 8 }), _validators.checkRequestValidity, _auth.basicAuth);

exports.default = authRoutes;