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
const authorizationMiddleware = require('../../middlewares/authorizationMiddleware');
/** middleware telechargement de fichier */
const upload = require('../../middlewares/fileMiddleware/uploadsFileMiddleware');
const uploadImageMiddleware = multer({ storage: upload.uploadImage });
const thumbnailMiddleware = require('../../middlewares/fileMiddleware/thumbnailMiddleware');
const awsMiddleware = require('../../middlewares/fileMiddleware/awsMiddleware');
/** suppression des cookies */
const deleteCookieMiddleware = require('../../middlewares/deleteCookieMiddleware');

/**controller user */
const userController = require('../../controllers/userController');
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const userSchemaValidation = require('../../validations/schemas/user');
  


router.route('/')
    /** récupération de tous les utilisateurs */
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
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
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.user),
        controllerHandler(userController.getUserById))

    /** update info utilisateur */
    .patch(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.user),
        uploadImageMiddleware.single('image'),                
        controllerHandler(thumbnailMiddleware),
        controllerHandler(awsMiddleware.uploadAWSBucket),  
        joiValidation(userSchemaValidation.updateUserSchema),        
        controllerHandler(userController.updateUserById))

    /** suppression utilisateur */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.user),
        controllerHandler(userController.deleteUserById));

/** modification mot de passe */
router.patch('/password/:id',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    joiValidation(userSchemaValidation.updatePasswordSchema),
    controllerHandler(userController.updatePassword));

/** recuperation d'une image d'un user*/
router.get('/image/:key',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    controllerHandler(userController.getAvatarByKey));

module.exports=router;