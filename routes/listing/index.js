const express = require('express');

const listingRouter = require('./listing');

const router = express.Router();

router.use('/', listingRouter);

module.exports = router;
