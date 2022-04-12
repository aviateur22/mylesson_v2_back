/**
 * Router thematic
 */
const express = require('express');
const router = express.Router();

/** récuperation du role utilisateur */
const roleMiddleware = require('../../middlewares/roleMiddleware');
/** récupération et mise en forme des cookies present dans la requete */
const cookieMiddleware = require('../../middlewares/cookieMiddleware');
/** vérification de token JWT  */
const authorizationMiddleware = require('../../middlewares/authorizationMiddleware');

/**controller user */
const thematicController = require('../../controllers/thematicController');
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');

/**recuperation de tous les links */
router.get('/', 
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.writer),
    controllerHandler(thematicController.getAllThematic));
module.exports=router;