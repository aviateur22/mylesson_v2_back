const express = require('express');
const resHeaderMiddleware = require('../middlewares/resHeaderMiddleware');
const router = express.Router();
const lessonRouter = require('./lessonRouter');
const markdownRouter = require('./markdownRouter');
const userRouter = require('./userRouter');
const notFound = require('../helpers/notFoundController');
const error = require('../errors');

/**Gestion requete client */
router.use('/users',resHeaderMiddleware, userRouter);

/**Gestion lessons */
router.use('/lessons',resHeaderMiddleware, lessonRouter);

//markdown
router.use('/markdown',markdownRouter);

/**middleware pour une chemin inconnu*/
router.use(notFound);

/**Middleware pour envoyer une erreur*/
router.use(error);

module.exports = router;