/** 
 * Schéma login  utilisateur 
 */
const Joi = require('joi');
module.exports = Joi.object({
    formToken: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token du formulaire invalide',
            'any.required': 'token du formulaire invalide'  
        })
});