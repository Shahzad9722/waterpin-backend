const express = require('express');

const messagesRouter = require('./messages');

const router = express.Router();

router.use('/', messagesRouter);

module.exports = router;
