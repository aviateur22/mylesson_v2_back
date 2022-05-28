const express = require('express');
const router = express.Router();
const tagRouter = require('./tagRouter');
const lessonRouter = require('./lessonRouter');
const userRouter = require('./userRouter');
const linkRouter = require('./linkRouter');
const thematicRouter = require('./thematicRouter');
const adminRouter = require('./adminRouter');
const notificationRouter = require('./notificationRouter');
const tokenRouter = require('./tokenRouter');
const { route } = require('./tokenRouter');

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

/** notification */
router.use('/notifications', notificationRouter);

/**token */
router.use('/tokens', tokenRouter);

module.exports = router;