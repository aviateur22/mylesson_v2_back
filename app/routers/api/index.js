const express = require('express');
const router = express.Router();
const resHeaderMiddleware = require('../../middlewares/resHeaderMiddleware');
const tagRouter = require('./tagRouter');
const lessonRouter = require('./lessonRouter');
const userRouter = require('./userRouter');
const linkRouter = require('./linkRouter');
const thematicRouter = require('./thematicRouter');
const adminRouter = require('./adminRouter');

/**Gestion requete client */
router.use('/users', userRouter);

/**Gestion lessons */
router.use('/lessons', lessonRouter);

/** gestion des links utilisateurs */
router.use('/links', linkRouter);

/** tags d'une lecon */
router.use('/tags', tagRouter);

/** thematcs des lecons */
router.use('/thematics', thematicRouter);

/** admin  */
router.use('/admin', adminRouter);

module.exports = router;