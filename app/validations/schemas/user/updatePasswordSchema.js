/** 
 * Schéma modification mot de passe 
 */
const Joi = require('joi');
module.exports = Joi.object({
    /* password: 8 charac, uppercase, number,pas d'espace et liste de special char */
    password: 
        Joi.string()
            .required()            
            .messages({
                'string.empty': 'votre ancien mot de passe est obligatoire',
                'any.required': 'votre ancien mot de passe est obligatoire'
            }),

    /* password: 8 charac, uppercase, number,pas d'espace et liste de special char */
    newPassword: Joi.string()
        .pattern(/^(?=.*?[A-Z])(?!.*?[ ])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .required()
        .messages({
            'string.empty': 'le nouveau mot de passe est obligatoire',
            'string.pattern.base': `le nouveau mot de passe doit avoir:\n
            8 characteres minimum\n
            1 majiscule minimum\n
            1 chiffre minimum\n
            1 charactere parmis #?!@$%^&*-`,
            'any.required':  'le nouveau mot de passe est obligatoire'
        }),           

    confirmNewPassword: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({
            'string.empty': 'la confirmation du nouveau mot de passe est obligatoire',
            'any.required': 'la confirmation du nouveau mot de passe est obligatoire',
            'any.only': 'la confirmation du mot de passe, ne correspond pas au nouveau mot de passe '
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