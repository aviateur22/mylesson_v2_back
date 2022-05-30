/** 
 * Schéma validation modification utilisateur 
 */
const Joi = require('joi');
module.exports = Joi.object({
    login:Joi.string()
        .pattern(/^[^ ][a-zA-Z\d*]+[^ ]$/)
        .required()
        .messages({
            'string.empty': 'le login ne peut pas être vide',
            'string.pattern.base': 'le login est composé uniquement de lettres et chiffres ',
            'any.required': 'le login ne peut pas être vide'
        }),
    
    email:Joi.string()
        .pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
        .required()
        .messages({
            'string.empty': 'l\'email est obligatoire',
            'string.pattern.base': 'erreur dans le format de l\'email',
            'any.required': 'l\'email est obligatoire'
        }),
    
    
    sex: Joi.any(),    
    /**token aléatoire*/
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token du formulaire invalide',
            'any.required': 'token du formulaire invalide'  
        }),
});