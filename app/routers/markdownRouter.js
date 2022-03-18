/**
 * Markdown test
 */
const express = require('express');
const markdownController = require('../controllers/markdownController');
const router = express.Router();

router.get('/tohtml', markdownController.toHtmlConverter);

module.exports = router;