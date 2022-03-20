/**Gestion des leçons*/
const express = require('express');
const router = express.Router();

/**Schéma de validation JOI */
const joiValidation = require('../../validations');

/** controller tag */
const controllerHandler = require('../../helpers/controllerHelper/controllerHandler');
const tagController = require('../../controllers').tag;

/** récuperarion des tags disponibles */
router.get('/', controllerHandler(tagController.findTag));

module.exports = router;