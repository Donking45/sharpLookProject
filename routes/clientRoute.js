const express = require('express');
const router = express.Router();
const { getClientHomepage } = require('../controllers/clientController');

router.get('/homepage', getClientHomepage);

module.exports = router;
