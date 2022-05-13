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
        }),
    value: Joi
        .boolean()
        .messages({
            'string.empty': 'format de la réponse incorrect',
            'any.required': 'format de la réponse incorrect'  
        })
});