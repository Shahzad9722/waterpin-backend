const express = require('express');

const profileRouter = require('./profile');

const router = express.Router();

router.use('/', profileRouter);

module.exports = router;
