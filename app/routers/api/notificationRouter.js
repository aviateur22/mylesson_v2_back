/**
 * Router notification
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
const notificationSchema = require('../../validations/schemas/notification');

/**middleware pour token formulaire */
const formTokenMiddleware = require('../../middlewares/tokenMiddleware');

const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const notificationController = require('../../controllers/notificationController');

/** creation d'une notification */
router.post('/',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    joiValidation(notificationSchema.notificationAcces),
    controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.createNotification));

/** suppression notification */
router.delete('/:notificationId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    joiValidation(notificationSchema.notificationAcces),
    controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.deleteNotification)
);

/** liste de notifications par id utilisateur */
router.post('/notification-by-user/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    joiValidation(notificationSchema.notificationAcces),
    controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.findNotificationByUserId)
);

/** count notification non lu par id utilisateur */
router.post('/notification-by-user/count/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    joiValidation(notificationSchema.notificationAcces),
    controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.countUnreadNotificationByUserId)
);

/** lecture notification par id */
router.patch('/read/:notificationId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    joiValidation(notificationSchema.updateNotification),    
    controllerHandler(notificationController.readNotificationById)
);

module.exports=router;