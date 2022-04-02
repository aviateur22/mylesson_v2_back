/**
 * Router link
 */
const express = require('express');
const router = express.Router();

/** récuperation du role utilisateur */
const roleMiddleware = require('../../middlewares/roleMiddleware');
/** récupération et mise en forme des cookies present dans la requete */
const cookieMiddleware = require('../../middlewares/cookieMiddleware');
/** vérification de token JWT  */
const authorizationMiddleware = require('../../middlewares/authorizationMiddleware');
/** vérification si l'action est éxecuté par le proprietaire ou un admin */
const belongToMiddleware = require('../../middlewares/belongToMiddleware');

/**controller user */
const linkController = require('../../controllers/linkController');
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const linkSchemaValidation = require('../../validations/schemas/link');

/**recuperation de tous les links */
router.get('/', 
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.writer),
    controllerHandler(linkController.getAllLinks));

router.route('/:linkId')
    /** récupération d'un link pour un utilisateur */
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),
        controllerHandler(linkController.getLinkById)
    )

    /** mise a jour d'un link pour un utilisateur */
    .patch(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),
        joiValidation(linkSchemaValidation.updateUserLinkSchema),
        controllerHandler(linkController.updateLinkById)
    )

    /** suppression d'un link */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),
        controllerHandler(linkController.deleteLinkById));

/** recuperation d'un link par son nom */
router.get('/name/:media',   
    controllerHandler(linkController.getLinkByName));

router.route('/user/:userId')
    /** ajout d'un nouveau link pour 1 utilsateur */
    .post(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),
        joiValidation(linkSchemaValidation.addUserLinkSchema),        
        controllerHandler(linkController.saveLinkByUserId)   
    )

    /** récuperation de tous les links d'un utilisateur */
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),        
        controllerHandler(linkController.getLinkByUserId));

module.exports=router;