/** 
 * Schéma validation inscription utilisateur 
 */
const Joi = require('joi');
module.exports = Joi.object({        
    /** code secret pour reset chiffré*/
    midToken: Joi
        .string()
        .required()
        .messages({    
            'string.empty': 'reset token obligatoire',
            'any.required': 'reset token obligatoire'  
        }),

    /** token pour le JWT présent en base de données*/
    token: Joi
        .string()
        .required()
        .messages({    
            'string.empty': 'token obligatoire',
            'any.required': 'token obligatoire'  
        }),
    
    /** id utilisateur chiffré*/
    userId: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'userId  obligatoire',
            'any.required': 'userId obligatoire'  
        }),

    /* password: 8 charac, uppercase, number,pas d'espace et liste de special char */
    password: Joi
        .string()
        .pattern(/^(?=.*?[A-Z])(?!.*?[ ])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .required()
        .messages({
            'string.empty': 'le mot de passe est obligatoire',
            'any.required': 'le mot de passe est obligatoire'  ,
            'string.pattern.base': `le mot de passe doit avoir:\n
            8 characteres minimum\n
            1 majiscule minimum\n
            1 chiffre minimum\n
            1 charactere parmis #?!@$%^&*-`
        }),  
    
    confirmPassword: Joi.string()
        .required()
        .equal(Joi.ref('password'))
        .messages({
            'string.empty': 'la confirmation du mot de passe est obligatoire',
            'any.required' : 'la confirmation du mot de passe est obligatoire',
            'any.only': 'le mot de passe et confirmation de mot de passe ne corresponde pas'
        })        
});
 
 