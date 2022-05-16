/**
 * Router pour envoie d'email
 */
const express = require('express');
const router = express.Router();


/** récupération et mise en forme des cookies present dans la requete */
const cookieMiddleware = require('../../middlewares/cookieMiddleware');

/**Schéma de validation JOI */
const joiValidation = require('../../validations');
const notificationSchema = require('../../validations/schemas/notification');

/**middleware pour token formulaire */
const formTokenMiddleware = require('../../middlewares/tokenFormMiddleware');

const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const mailController = require('../../controllers/mailController');

/** creation d'une notification */
router.post('/send/reset-password',
    controllerHandler(cookieMiddleware),
    // joiValidation(notificationSchema.notificationAcces),
    // controllerHandler(formTokenMiddleware.getFormToken),
    controllerHandler(mailController.sendEmail));

module.exports=router;