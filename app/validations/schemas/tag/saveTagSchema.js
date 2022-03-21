/**
 * schéma de validation création - update d'un tag
 */
const Joi = require('joi');
module.exports = Joi.object({      
    name:Joi.string()
        /**Espace début et fin interdit - lettre et chiffre ok  */
        .pattern(/^[^ ][a-zA-Z0-9\d*\s]+[^ ]$/)
        .required()
        .messages({            
            'string.pattern.base': 'le nom du tag comporte uniquement des chiffres et des lettres',
            'string.empty': 'le nom du tag est obligatoire',
            'any.required': 'le nom du tag est obligatoire'
        })
});