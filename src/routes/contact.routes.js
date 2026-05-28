const express = require('express');
const router = express.Router();
const { createContactHandler } = require('../controllers/contact.controller');

router.post('/contact', createContactHandler);

module.exports = router;