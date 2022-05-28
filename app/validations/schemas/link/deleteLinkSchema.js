/**
 * schéma d'ajout d'un nouveau link utilisateur
 */
const Joi = require('joi');
module.exports = Joi.object({      
    
    mediaLinkId: Joi.number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant média est incorrect',
            'string.empty': 'absence de données sur la compagnie',
            'any.required': 'absence de données sur la compagnie',
        }),
        
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
});
 