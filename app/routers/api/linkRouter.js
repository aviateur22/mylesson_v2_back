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

/** middleware pour le token formulaire */
const formTokenMiddleware = require('../../middlewares/tokenMiddleware');

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

/** récupération d'un link pour un utilisateur */
router.get('/:linkId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.writer),
    controllerHandler(belongToMiddleware),
    controllerHandler(linkController.getLinkById));
    
/** suppression d'un link */
router.route('/user/:userId')
    /** suppression d'un link par id utilisateu */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),
        joiValidation(linkSchemaValidation.deleteLinkSchema),
        controllerHandler(formTokenMiddleware.getFormToken),  
        controllerHandler(formTokenMiddleware.setFormToken), 
        controllerHandler(linkController.deleteLinkByUserId))
    /** ajout d'un nouveau link pour 1 utilsateur */
    .post(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),
        joiValidation(linkSchemaValidation.saveUserLinkSchema),
        controllerHandler(formTokenMiddleware.getFormToken),    
        controllerHandler(formTokenMiddleware.setFormToken), 
        controllerHandler(linkController.saveLinkByUserId))
    /** récuperation de tous les links d'un utilisateur */
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.writer),
        controllerHandler(belongToMiddleware),        
        controllerHandler(linkController.getLinkByUserId));

/** recuperation d'un link par son nom */
router.get('/name/:media',   
    controllerHandler(linkController.getLinkByName));    

module.exports=router;