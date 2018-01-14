'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

/* GET api home. */
exports.default = (0, _express.Router)().get('/', (req, res) => res.status(200).json({ status: 'success', message: 'Welcome to the WeVote api.' }));