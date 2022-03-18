/**
 * schéma de validation pour une nouvelle leçon
 */
const Joi = require('joi');
module.exports = Joi.object({      
    title:Joi.string()
        /**Espace début et fin interdit - lettre et chiffre ok  */
        .pattern(/^[^ ][a-zA-Z\d*\s]+[^ ]$/)
        .required()
        .messages({            
            'string.pattern.base': 'le titre comporte uniquement des chiffres et des lettres',
            'string.empty': 'le titre est obligatoire'
        }),
    content:Joi.string()
        .required()  
        .messages({    
            'any.required': 'le contenu ne peu pas être vide'
        })
});