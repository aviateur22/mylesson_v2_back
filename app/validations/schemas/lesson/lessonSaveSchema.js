/**
 * schéma de validation création d'une nouvelle leçon
 */
const Joi = require('joi');
module.exports = Joi.object({      
    title:Joi.string()
        /**Espace début et fin interdit - lettre et chiffre ok  */
        .pattern(/^[^ ][a-zA-Z0-9\d*\s]+[^ ]$/)
        .required()
        .messages({            
            'string.pattern.base': 'le titre comporte uniquement des chiffres et des lettres',
            'string.empty': 'le titre de la leçon est obligatoire',
            'any.required': 'le titre de la leçon est obligatoire'
        }),
    content:Joi.string()
        .required()  
        .messages({    
            'string.empty': 'le contenu de la leçon ne peut pas être vide',
            'any.required': 'le contenu de la leçon ne peut pas être vide'
        }),
    tagId: Joi
        .string()
        // eslint-disable-next-line no-useless-escape
        .pattern(/^\d+(\/\d+)*$/)
        .required()
        .messages({    
            'string.empty': 'une leçon doit avoir au moins 1 tag',
            'any.required': 'une leçon doit avoir au moins 1 tag',
            'string.pattern.base': 'le format des tags n\'est pas valide',
        }),        
    userId: Joi
        .number()
        .messages({
            'number.base': 'le format de l\'identifiant utilisateur est incorrect'
        })
});