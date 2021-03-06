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

/**middleware pour token formulaire */
const formTokenMiddleware = require('../../middlewares/tokenMiddleware');
/**controller user */
const userController = require('../../controllers/userController');
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const userSchemaValidation = require('../../validations/schemas/user');

/** midlleware reset mot de passe ou activation du compte */
const urlMiddleware = require('../../middlewares/urlMiddlware');
const tokenMiddleware = require('../../middlewares/tokenMiddleware');
  


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
        controllerHandler(cookieMiddleware),
        controllerHandler(tokenMiddleware.getVisitortoken),
        joiValidation(userSchemaValidation.registerUserSchema),
        controllerHandler(userController.register)
    );

/** connection client */
router.post('/login',
    controllerHandler(cookieMiddleware),
    controllerHandler(tokenMiddleware.getVisitortoken),
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
        //controllerHandler(formTokenMiddleware.setFormToken),
        controllerHandler(userController.getUserById))

    /** update info utilisateur */
    .patch(
        controllerHandler(cookieMiddleware),
        controllerHandler(authorizationMiddleware),
        controllerHandler(roleMiddleware.user),
        controllerHandler(belongToMiddleware),        
        joiValidation(userSchemaValidation.updateUserSchema), 
        controllerHandler(formTokenMiddleware.getFormToken), 
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
    controllerHandler(formTokenMiddleware.getFormToken),
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
    controllerHandler(formTokenMiddleware.getFormToken),  
    controllerHandler(thumbnailMiddleware),
    controllerHandler(awsMiddleware.uploadAWSBucket),  
    controllerHandler(userController.updateImageByUserId));

/** récupération d'un image sans être authentifié */
router.get('/image/autor/:key',
    controllerHandler(userController.getAvatarByKey));

/**demande d'update privilege éditeur */
router.post('/request-upgrade-privilege/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(roleMiddleware.user),    
    controllerHandler(belongToMiddleware),
    joiValidation(userSchemaValidation.requestUpgradeRole),
    controllerHandler(userController.userUpgradeRoleRequest));

/** envoie email mot de passe perdu */
router.post('/lost-password/:email',
    controllerHandler(cookieMiddleware),
    controllerHandler(tokenMiddleware.getVisitortoken),
    joiValidation(userSchemaValidation.userSendEmailPasswordSchema),
    controllerHandler(userController.sendEmailPasswordLost)
);

/**reset mot de passe */
router.post('/reset-password',
    controllerHandler(cookieMiddleware),
    controllerHandler(tokenMiddleware.getVisitortoken),
    joiValidation(userSchemaValidation.resetPasswordSchema),
    controllerHandler(urlMiddleware.getUrlParameter),
    controllerHandler(userController.resetPasswordByUserId));
module.exports=router;