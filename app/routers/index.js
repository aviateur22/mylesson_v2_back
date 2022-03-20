const express = require('express');
const router = express.Router();

/** router api */
const apiRouter = require('./api');

/** test markdown */
const markdownRouter = require('./markdownRouter');

/** router 404 */
const notFound = require('../controllers/notFoundController');

/** router error */
const error = require('../controllers/errorController');

/** api */
router.use('/api', apiRouter);

//markdown
router.use('/markdown',markdownRouter);

/** 404*/
router.use(notFound);

/** error*/
router.use(error);

module.exports = router;