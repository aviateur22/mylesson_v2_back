/** 
 * Schéma modification d'une notification
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
    userId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant utilisateur est incorrect',
            'any.required': 'l\'identifiant utilisateur est manquant'
        }),
});