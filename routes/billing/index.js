const express = require('express');

const billingRouter = require('./billing');

const router = express.Router();

router.use('/', billingRouter);

module.exports = router;
