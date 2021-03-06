/** 
 * Schéma access notification
 */
const Joi = require('joi');
module.exports = Joi.object({    
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
});