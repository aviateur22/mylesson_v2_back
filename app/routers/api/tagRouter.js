/**Gestion des leçons*/
const express = require('express');
const router = express.Router();

/**Schéma de validation JOI */
const joiValidation = require('../../validations');

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
router.get('/:name', controllerHandler(tagController.findTagByName));

/** récuperarion des tags disponibles */
router.route('/') 
    /** ajout d'un tag */
    .post(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        controllerHandler(tagController.addTag))

    /** récuperation de tous les tags */
    .get(controllerHandler(tagController.getAllTag));

router.route('/:id')
    /** récupération d'un tag*/
    .get(controllerHandler(tagController.getTagById))

    /** modification d'un tag */
    .patch(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        controllerHandler(tagController.updateTagById))

    /** suppression d'un tag */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),    
        controllerHandler(roleMiddleware.admin),
        controllerHandler(tagController.deleteTagById));

module.exports = router;