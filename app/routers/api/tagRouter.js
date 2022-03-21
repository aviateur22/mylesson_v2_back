/**Gestion des leçons*/
const express = require('express');
const router = express.Router();

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const tagSchemaValidation = require('../../validations/schemas/tag');

/** role */
const roleMiddleware = require('../../middlewares/roleMiddleware');
/** récupération des cookies */
const cookieMiddleware = require('../../middlewares/cookieMiddleware');
/** authorisation  */
const authorization = require('../../middlewares/authorizationMiddleware');

/** controller tag */
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const tagController = require('../../controllers').tag;

/** récuperarion des tags disponibles */
router.get('/name/:name', controllerHandler(tagController.findTagByName));

/** récuperarion des tags disponibles */
router.route('/') 
    /** ajout d'un tag */
    .post(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        joiValidation(tagSchemaValidation.saveTagSchema),
        controllerHandler(tagController.addTag))

    /** récuperation de tous les tags */
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        controllerHandler(tagController.getAllTag));

router.route('/:id')
    /** récupération d'un tag*/
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        controllerHandler(tagController.getTagById))

    /** modification d'un tag */
    .patch(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        joiValidation(tagSchemaValidation.saveTagSchema),
        controllerHandler(tagController.updateTagById))

    /** suppression d'un tag */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        controllerHandler(tagController.deleteTagById));

module.exports = router;