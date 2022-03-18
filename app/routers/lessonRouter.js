/**Gestion des leçons*/
const express = require('express');
const router = express.Router();

/**Schéma de validation JOI */
const joiValidation = require('../validations');
const updateSchemaValidation = require('../validations/schemas/updateLessonSchema');

/**middleware auth et identity */
const authMiddleware = require('../middlewares/authMiddleware');
const cookieMiddleware = require('../middlewares/cookieMiddleware');
const identityMiddleware = require('../middlewares/identityMiddleware');

/**controller lesson */
const controllerHandler = require('../helpers/controllerHelper/controllerHandler');
const lessonController = require('../controllers/lessonController');

/** */
router.get('/', lessonController.getAll);

/**Creation d'une lecon */
router.post('/auth', 
    controllerHandler(authMiddleware.connected),
    controllerHandler(authMiddleware.teacher),
    controllerHandler(cookieMiddleware),
    controllerHandler(identityMiddleware),
    controllerHandler(lessonController.create()));

/** gestion lesson par id */
router.route('/auth/:id')
    /** Récuperation d'une leçon */
    .get(controllerHandler(lessonController.getById()))
    /** Suppression d'une leçon */
    .delete(controllerHandler(lessonController.delete))
    /**Update d'une leçon */
    .patch(        
        controllerHandler(cookieMiddleware),
        controllerHandler(identityMiddleware),
        joiValidation(updateSchemaValidation),  
        controllerHandler(lessonController.update()));

/** recuperation lessons de 1 utilisateur*/
router.get('/auth/user/user-lesson',controllerHandler(lessonController.getByUserId()));

/**upload de 1 lesson */
router.post('/auth/upload',controllerHandler(lessonController.upload));

/**recuperarion des tags disponibles */
router.post('/auth/tags',controllerHandler(lessonController.findTag));

module.exports = router;

