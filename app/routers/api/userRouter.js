/**
 * Router user
 */
const express = require('express');
const router = express.Router();
const multer =  require('multer');

/**genration UUID */
const uuidGenerator = require('../../helpers/security/uuidGenerator');

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

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const userSchemaValidation = require('../../validations/schemas/user');

/** module pour parmaetrer l'upload des images */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {         
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
            console.log(file.mimetype === 'image/png');
            cb(null, 'uploads/');
        } else {
            /** le format de l'image n'est pas correcte */
            cb({message: 'seules les images au format JPEG et PNG sont acceptées', statusCode:'400'});
        }        
    },
    /** si le format est validé on génére un identifiant unique est on la stock */
    filename: function(req, file, cb) {
        /** genration d'un uuid pour l'image */
        const uniqueSuffix = uuidGenerator();
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
  
const upload = multer({ storage: storage });
const uploadText = multer();
//const upload = multer({dest : 'uploads/'});

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
        upload.single('image'),                
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

module.exports=router;