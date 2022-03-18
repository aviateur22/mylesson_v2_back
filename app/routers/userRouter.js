/**
 * Router user
 */
const express = require('express');
const router = express.Router();

/**controller user */
const userController = require('../controllers/userController');
const controllerHandler = require('../helpers/controllerHelper/controllerHandler');

/**middleware */
const deleteCookieMiddleware = require('../middlewares/deleteCookieMiddleware');

/**Schéma de validation JOI */
const joiValidation = require('../validations');
const signupSchemaValidation = require('../validations/schemas/signupSchema');

/** inscription client*/
router.post('/signup',joiValidation(signupSchemaValidation), controllerHandler(userController.signupAction()));

/** connection client */
router.post('/login', controllerHandler(userController.loginAction()));

/** deconnexion client */
router.get('/logout',deleteCookieMiddleware,controllerHandler(userController.logoutAction));

/*
 * gestion information client
 */
router.route('/auth/:id')
    .get(controllerHandler(userController.getOne))
    .patch(controllerHandler(userController.update))
    .delete(controllerHandler(userController.delete));

module.exports=router;