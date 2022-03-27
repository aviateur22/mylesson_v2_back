/** 
 * Schéma validation inscription utilisateur 
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
        
    /* password: 8 charac, uppercase, number,pas d'espace et liste de special char */
    password: Joi.string()
        .pattern(/^(?=.*?[A-Z])(?!.*?[ ])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .required()
        .messages({
            'string.empty': 'le mot de passe est obligatoire',
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

