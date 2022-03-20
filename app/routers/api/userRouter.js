/**
 * Router user
 */
const express = require('express');
const router = express.Router();

/**controller user */
const userController = require('../../controllers/userController');
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');

/**middleware */
const deleteCookieMiddleware = require('../../middlewares/deleteCookieMiddleware');

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const userSchemaValidation = require('../../validations/schemas/user');

/** inscription client*/
router.post('/register',
    joiValidation(userSchemaValidation.registerUserSchema),
    controllerHandler(userController.registerAction()));

/** connection client */
router.post('/login',
    joiValidation(userSchemaValidation.loginUserSchema), 
    controllerHandler(userController.loginAction()));

/** deconnexion client */
router.get('/logout',
    controllerHandler(deleteCookieMiddleware),
    controllerHandler(userController.logoutAction));

/** récupertion de tous les utilisateurs */
router.get('/', controllerHandler(userController.getAllUser));

/** gestion information client */
router.route('/:id')
    .get(controllerHandler(userController.getUserById))
    .patch(controllerHandler(userController.updateUserById))
    .delete(controllerHandler(userController.deleteUserById));

/** modification mot de passe */
router.patch('/password/:id',
    joiValidation(userSchemaValidation.updatePasswordSchema),
    controllerHandler(userController.updatePassword));

module.exports=router;