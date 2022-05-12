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

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const adminSchemaValidation = require('../../validations/schemas/admin');

/**middleware pour token formulaire */
const formTokenMiddleware = require('../../middlewares/tokenFormMiddleware');

const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const adminController = require('../../controllers/adminController');

/**mise a jour des privilege d'un utilisateur par son id */
router.patch('/upgrade-user/:userId',  
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.admin),
    controllerHandler(belongToMiddleware),
    joiValidation(adminSchemaValidation.changePrivilege),
    controllerHandler(formTokenMiddleware.getFormToken), 
    controllerHandler(adminController.upgradeUserPrivilige)
);

/**récupere ltous les utilisateurs voulant pouvoir editer */
router.get('/upgrade-request',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),    
    controllerHandler(roleMiddleware.admin),
    controllerHandler(adminController.getUserUpgradeRequest)
);

/**supprime le privilege d'edition par logind'un user */
router.post('/remove-privilege/:userLogin',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),    
    controllerHandler(roleMiddleware.admin),
    joiValidation(adminSchemaValidation.changePrivilege),
    controllerHandler(formTokenMiddleware.getFormToken), 
    controllerHandler(adminController.removeUserPrivilege)
);

/**récupéere toutes les lecons ayant un contenu abusif */
router.get('/abusive-content',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),    
    controllerHandler(roleMiddleware.admin),
    controllerHandler(adminController.getAllAbusiveContent)
);

/**suppréssion utilisateur */
router.post('/delete-user/:userLogin',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.admin),
    joiValidation(adminSchemaValidation.deleteUserSchema),
    controllerHandler(formTokenMiddleware.getFormToken), 
    controllerHandler(adminController.deleteUserByLogin)
);
module.exports=router;