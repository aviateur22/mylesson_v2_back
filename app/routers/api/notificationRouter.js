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

/**middleware pour token formulaire */
const formTokenMiddleware = require('../../middlewares/tokenFormMiddleware');

const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const notificationController = require('../../controllers/notificationController');

/** creation d'une notification */
router.post('/',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(roleMiddleware.user),
    controllerHandler(formTokenMiddleware),
    controllerHandler(notificationController.createNotification));

/** suppression notififcation */
router.delete('/:notificationId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    //controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.deleteNotification)
);

router.get('/notification-by-user/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    //controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.findNotificationByUserId)
);

router.get('/notification-by-user/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    //controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.findNotificationByUserId)
);

router.get('/notification-by-user/count/:userId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    //controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.countUnreadNotificationByUserId)
);

router.patch('/read/:notificationId',
    controllerHandler(cookieMiddleware),
    controllerHandler(authorizationMiddleware),
    controllerHandler(belongToMiddleware),
    controllerHandler(roleMiddleware.user),
    //controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(notificationController.readNotificationById)
);

module.exports=router;