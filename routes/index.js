const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({info: 'Waterpin - API v2.0.0'});
});

module.exports = router;
