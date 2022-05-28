/** 
 * Schéma modification privilege utilisateur 
 */
const Joi = require('joi');
module.exports = Joi.object({
    /**secret token */
    secret: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token du formulaire invalide',
            'any.required': 'token du formulaire invalide'  
        }),
    /**token aléatoire*/
    token: Joi
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