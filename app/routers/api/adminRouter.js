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

const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const adminController = require('../../controllers/adminController');

router.patch('/upgrade-user/:userId',  
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.admin),
    controllerHandler(belongToMiddleware),
    controllerHandler(adminController.upgradeUserPrivilige)
);

router.get('/upgrade-request',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.admin),
    controllerHandler(adminController.getUserUpgradeRequest)
);

module.exports=router;