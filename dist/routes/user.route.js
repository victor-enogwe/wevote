'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _check = require('express-validator/check');

var _validators = require('../middlewares/validators.middleware');

var _auth = require('../controllers/v1/auth.controller');

var _user = require('../controllers/v1/user.controller');

const userRoutes = (0, _express.Router)();

userRoutes.post('/create', (0, _check.body)('firstname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g'), (0, _check.body)('surname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g'), (0, _check.body)('email').isEmail(), (0, _check.body)('password', 'min of 8 chars').isLength({ min: 8 }), (0, _check.body)('phone').matches(/0\d{10}/).optional(), _validators.checkRequestValidity, _user.createUser).use(_auth.verifyToken).get('/', (0, _check.query)('limit', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(), (0, _check.query)('offset', 'integer >1<50').isInt({ min: 1, max: 50 }).optional(), _validators.checkRequestValidity, _user.getUsers).get('/:uuid', (0, _check.param)('uuid').isUUID(4).optional(), _validators.checkRequestValidity, _user.getUser).patch('/update/:uuid', (0, _check.param)('uuid').isUUID(4), (0, _check.body)('firstname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g').optional(), (0, _check.body)('surname', '3-50 letters').matches(/[A-Za-z]{3,50}/, 'g').optional(), (0, _check.body)('email').isEmail().optional(), (0, _check.body)('password', 'min of 8 chars').isLength({ min: 8 }).optional(), (0, _check.body)('phone').matches(/0\d{10}/).optional(), _validators.checkRequestValidity, _user.updateUser);

exports.default = userRoutes;