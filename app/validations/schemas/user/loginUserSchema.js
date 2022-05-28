/** 
 * Schéma login  utilisateur 
 */
const Joi = require('joi');
module.exports = Joi.object({
    email:Joi
        .string()
        .pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
        .required()
        .messages({
            'any.required': 'l\'email est obligatoire',
            'string.empty': 'votre email est manquant',
            'string.pattern.base': 'le format de votre email n\'est pas valide'            
        }),        
    /* password: 8 charac, uppercase, number,pas d'espace et liste de special char */
    password: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'le mot de passe est manquant',
            'any.required': 'le login ne peut pas être vide'            
        }),
    /** token pour le JWT présent en base de données*/
    token: Joi
        .string()
        .required()
        .messages({    
            'string.empty': 'token obligatoire',
            'any.required': 'token obligatoire'  
        }),        
});