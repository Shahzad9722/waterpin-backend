const express = require('express');

const destinationsRouter = require('./destinations');

const router = express.Router();

router.use('/', destinationsRouter);

module.exports = router;
