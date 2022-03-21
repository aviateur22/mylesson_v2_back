/**Gestion des leçons*/
const express = require('express');
const router = express.Router();

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const lessonSchemaValidation = require('../../validations/schemas/lesson');

/** role */
const roleMiddleware = require('../../middlewares/roleMiddleware');
/** récupération des cookies */
const cookieMiddleware = require('../../middlewares/cookieMiddleware');
/** authorisation  */
const authorization = require('../../middlewares/authorizationMiddleware');

/**controller lesson */
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const lessonController = require('../../controllers/lessonController');

/** récupération de toutes les lessons */
router.get('/', lessonController.getAll);

/** création d'une lecon */
router.post('/',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorization),
    controllerHandler(roleMiddleware.writer),
    joiValidation(lessonSchemaValidation.lessonSaveSchema),    
    controllerHandler(lessonController.create));

/** gestion lesson par id */
router.route('/:id')
    /** Récuperation d'une leçon */
    .get(controllerHandler(lessonController.getById))

    /** Suppression d'une leçon */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.writer),
        joiValidation(lessonSchemaValidation.lessonDeleteSchema),
        controllerHandler(lessonController.deleteById))

    /**Update d'une leçon */
    .patch(        
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),
        controllerHandler(roleMiddleware.writer),        
        joiValidation(lessonSchemaValidation.lessonSaveSchema),  
        controllerHandler(lessonController.updateById));

/** récupération des lessons d'un utilisateur*/
router.get('/user/:id',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorization),
    controllerHandler(roleMiddleware.writer),
    controllerHandler(lessonController.getByUserId));

/** upload de 1 lesson */
router.post('/file/upload',controllerHandler(lessonController.upload));

module.exports = router;

