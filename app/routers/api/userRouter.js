/**
 * Router user
 */
const express = require('express');
const router = express.Router();
const multer =  require('multer');

/** récuperation du role utilisateur */
const roleMiddleware = require('../../middlewares/roleMiddleware');
/** récupération et mise en forme des cookies present dans la requete */
const cookieMiddleware = require('../../middlewares/cookieMiddleware');
/** suppression des cookies */
const deleteCookieMiddleware = require('../../middlewares/deleteCookieMiddleware');
/** vérification de token JWT  */
const authorizationMiddleware = require('../../middlewares/authorizationMiddleware');
/** vérification si l'action est éxecuté par le proprietaire ou un admin */
const belongToMiddleware = require('../../middlewares/belongToMiddleware');
/** middleware upload de fichier de fichier */
const upload = require('../../middlewares/fileMiddleware/uploadsFileMiddleware');
const uploadImageMiddleware = multer({ storage: upload.uploadImage });
const folderExistMiddleware = require('../../middlewares/fileMiddleware/folderExistMiddleware');
/** convertie l'image client en thumbnail */
const thumbnailMiddleware = require('../../middlewares/fileMiddleware/thumbnailMiddleware');
/** gestion stockage image dans AWS S3 bucket */
const awsMiddleware = require('../../middlewares/fileMiddleware/awsMiddleware');

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
router.route('/:userId')
    /** récupération info utilisateur*/
    .get(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.user),
        controllerHandler(belongToMiddleware),
        controllerHandler(userController.getUserById))

    /** update info utilisateur */
    .patch(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.user),
        controllerHandler(belongToMiddleware),        
        joiValidation(userSchemaValidation.updateUserSchema),        
        controllerHandler(userController.updateUserById))

    /** suppression utilisateur */
    .delete(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.user),
        controllerHandler(belongToMiddleware),
        controllerHandler(userController.deleteUserById));

/** modification mot de passe */
router.patch('/password/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    controllerHandler(belongToMiddleware),
    joiValidation(userSchemaValidation.updatePasswordSchema),
    controllerHandler(userController.updatePassword));

/** recuperation d'une image d'un user authentifié */
router.get('/image/:key',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    controllerHandler(userController.getAvatarByKey));

/** mise a jour d'une image */
router.patch('/image/:userId', 
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    controllerHandler(belongToMiddleware),
    controllerHandler(folderExistMiddleware.uploadFolder),
    uploadImageMiddleware.single('image'),                
    controllerHandler(thumbnailMiddleware),
    controllerHandler(awsMiddleware.uploadAWSBucket),  
    controllerHandler(userController.updateImageByUserId));

/** récupération d'un image sans être authentifié */
router.get('/image/autor/:key',
    controllerHandler(userController.getAvatarByKey));

module.exports=router;