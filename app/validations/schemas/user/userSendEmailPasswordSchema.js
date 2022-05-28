/** 
 * Schéma validation inscription utilisateur 
 */
const Joi = require('joi');
module.exports = Joi.object({    
    /** token pour le JWT présent en base de données*/
    token: Joi
        .string()
        .required()
        .messages({    
            'string.empty': 'token obligatoire',
            'any.required': 'token obligatoire'  
        }),        
});