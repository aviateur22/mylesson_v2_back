/**
 * Router user
 */
const express = require('express');
const router = express.Router();
const multer =  require('multer');

/** role */
const roleMiddleware = require('../../middlewares/roleMiddleware');
/** récupération des cookies */
const cookieMiddleware = require('../../middlewares/cookieMiddleware');
/** authorisation  */
const authorization = require('../../middlewares/authorizationMiddleware');


/**controller user */
const userController = require('../../controllers/userController');
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');

/**middleware */
const deleteCookieMiddleware = require('../../middlewares/deleteCookieMiddleware');

/** middleware telechargement de fichier */
const upload = require('../../middlewares/uploadsFileMiddleware');
const uploadImage = multer({ storage: upload.uploadImage });

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const userSchemaValidation = require('../../validations/schemas/user');
  


router.route('/')
    /** récupération de tous les utilisateurs */
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),
        controllerHandler(roleMiddleware.admin),
        controllerHandler(userController.getAllUser)
    )

    /**creation d'un nouvel utilisateur */
    .post(
        joiValidation(userSchemaValidation.registerUserSchema),
        controllerHandler(userController.register)
    );

/** connection client */
router.post('/login',
    joiValidation(userSchemaValidation.loginUserSchema), 
    controllerHandler(userController.login));

/** deconnexion client */
router.post('/logout',
    controllerHandler(deleteCookieMiddleware),
    controllerHandler(userController.logout));

/** gestion information client */
router.route('/:id')
    /** récupération info utilisateur*/
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),
        controllerHandler(roleMiddleware.user),
        controllerHandler(userController.getUserById))

    /** update info utilisateur */
    .patch(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),
        controllerHandler(roleMiddleware.user),
        uploadImage.single('image'),                
        joiValidation(userSchemaValidation.updateUserSchema),        
        controllerHandler(userController.updateUserById))

    /** suppression utilisateur */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorization),
        controllerHandler(roleMiddleware.user),
        controllerHandler(userController.deleteUserById));

/** modification mot de passe */
router.patch('/password/:id',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorization),
    controllerHandler(roleMiddleware.user),
    joiValidation(userSchemaValidation.updatePasswordSchema),
    controllerHandler(userController.updatePassword));

/** recuperation de l'avatar d'un user*/
router.get('/image/:key',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorization),
    controllerHandler(roleMiddleware.user),
    controllerHandler(userController.getAvatarByKey));

module.exports=router;