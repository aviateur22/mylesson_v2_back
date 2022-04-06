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

/** vérification si l'action est éxecuté par le proprietaire ou un admin */
const belongToMiddleware =  require('../../middlewares/belongToMiddleware');

/**middleware pour token formulaire */
const formTokenMiddleware = require('../../middlewares/tokenFormMiddleware');

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
    controllerHandler(belongToMiddleware),
    joiValidation(lessonSchemaValidation.lessonSaveSchema),    
    controllerHandler(formTokenMiddleware.getFormToken),

    controllerHandler(lessonController.create));

/** generation token formulaire */
router.get('/token/:userId', 
    controllerHandler(cookieMiddleware),
    controllerHandler(authorization),
    controllerHandler(roleMiddleware.writer),
    controllerHandler(belongToMiddleware),
    controllerHandler(formTokenMiddleware.setFormToken),
    controllerHandler(lessonController.getTokenByUserId));

/** gestion lesson par id */
router.route('/:lessonId')
    /** Récuperation d'une leçon pour son édition*/
    .get(
        controllerHandler(formTokenMiddleware.setFormToken),
        controllerHandler(lessonController.getById))

    /** Suppression d'une leçon */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),
        joiValidation(lessonSchemaValidation.lessonDeleteSchema),
        controllerHandler(formTokenMiddleware.getFormToken), 
        controllerHandler(lessonController.deleteById))

    /**Update d'une leçon */
    .patch(        
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),
        controllerHandler(roleMiddleware.writer),  
        controllerHandler(belongToMiddleware),      
        joiValidation(lessonSchemaValidation.lessonSaveSchema), 
        controllerHandler(formTokenMiddleware.getFormToken), 
        /** generation d'un nouveau token  */       
        controllerHandler(formTokenMiddleware.setFormToken), 
        controllerHandler(lessonController.updateById));

/** récupération des lessons d'un utilisateur*/
router.get('/user/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorization),
    controllerHandler(roleMiddleware.writer),
    controllerHandler(belongToMiddleware),
    controllerHandler(lessonController.getByUserId));

/** recuperation d'une lecon par son slug pour une lecture*/
router.get('/slug/:slug',
    controllerHandler(lessonController.getLessonBySlug));

/** upload de 1 lesson */
router.post('/file/upload',controllerHandler(lessonController.upload));

/** filtre les lecons par tags */
router.post('/filter/tags',
    joiValidation(lessonSchemaValidation.lessonFilterByTagShema),
    controllerHandler(lessonController.getLessonByTag));

module.exports = router;

