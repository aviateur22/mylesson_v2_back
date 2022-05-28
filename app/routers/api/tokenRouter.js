/**
 * Router admin
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

/** JWT expires in */
const jwtExpireIn = require('../../helpers/jwtExpire');

const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const tokenController = require('../../controllers/tokenController');
const tokenMiddleware = require('../../middlewares/tokenMiddleware');

/** generation token formulaire */
router.post('/:userId', 
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    controllerHandler(belongToMiddleware),
    controllerHandler(tokenController.generateToken(jwtExpireIn.std.expiresIn)));

/**génration token sans être authentifié */
router.get('/visitor',
    controllerHandler(tokenController.generateVisitorToken(jwtExpireIn.visitor.expiresIn)));

module.exports=router;