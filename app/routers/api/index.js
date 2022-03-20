const express = require('express');
const router = express.Router();
const resHeaderMiddleware = require('../../middlewares/resHeaderMiddleware');
const tagRouter = require('./tagRouter');
const lessonRouter = require('./lessonRouter');
const userRouter = require('./userRouter');

/**Gestion requete client */
router.use('/users',resHeaderMiddleware, userRouter);

/**Gestion lessons */
router.use('/lessons',resHeaderMiddleware, lessonRouter);

/** tags d'une lecon */
router.use('/tags', tagRouter);

module.exports = router;