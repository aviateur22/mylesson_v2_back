const express = require('express');
const router = express.Router();
const resHeaderMiddleware = require('../../middlewares/resHeaderMiddleware');
const tagRouter = require('./tagRouter');
const lessonRouter = require('./lessonRouter');
const userRouter = require('./userRouter');
const linkRouter = require('./linkRouter');
const thematicRouter = require('./thematicRouter');

/**Gestion requete client */
router.use('/users',resHeaderMiddleware, userRouter);

/**Gestion lessons */
router.use('/lessons',resHeaderMiddleware, lessonRouter);

/** gestion des links utilisateurs */
router.use('/links', linkRouter);

/** tags d'une lecon */
router.use('/tags', tagRouter);

/** thematcs des lecons */
router.use('/thematics', thematicRouter);

module.exports = router;