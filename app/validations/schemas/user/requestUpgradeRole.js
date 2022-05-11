/** 
 * Schéma modification mot de passe 
 */
const Joi = require('joi');
module.exports = Joi.object({
    /** token */
    formToken: Joi
        .string()
        .required()
        .messages({    
            'string.empty': 'token du formulaire invalide',
            'any.required': 'token du formulaire invalide'  
        }),
});