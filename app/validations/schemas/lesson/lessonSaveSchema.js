/**
 * schéma de validation création d'une nouvelle leçon
 */
const { number } = require('joi');
const Joi = require('joi');
module.exports = Joi.object({
    /** tag - non utilisé */
    tag: Joi.any(),

    title:Joi.string()
        /**Espace début et fin interdit - lettre et chiffre ok  */
        .pattern(/^[^ ][a-zA-Z0-9\d*\séè¨çàùê']+[^ ]$/)
        .required()
        .messages({            
            'string.pattern.base': 'le titre comporte uniquement des chiffres et des lettres',
            'string.empty': 'le titre de la leçon est obligatoire',
            'any.required': 'le titre de la leçon est obligatoire'
        }),

    /** contenu de le lecon */
    content: Joi.string()
        .required()  
        .messages({    
            'string.empty': 'le contenu de la leçon ne peut pas être vide',
            'any.required': 'le contenu de la leçon ne peut pas être vide'  
        }),

    /** résumé de la lecon */
    summary: Joi.string()
        .required()  
        .messages({    
            'string.empty': 'le résumé de la leçon est obligatoire',
            'any.required': 'le résumé de la leçon est obligatoire'  
        }),

    /** id des tags */
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
    
    /** id de lutilisateur */
    userId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant utilisateur est incorrect',
            'any.required': 'l\'identifiant utilisateur est obligatoire'
        }),
    
    thematicId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant de la thématique est incorrect',
            'any.required': 'la sélection d\'une thématique est obligatoire'
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