/** 
 * Schéma validation update leçon 
 */
const Joi = require('joi');
module.exports = Joi.object({    
    /** mot restant dans l'input tag*/
    tag:Joi.any(),
    /**tagid format :1/2/9/17 */
    tagId:Joi.string()
        // eslint-disable-next-line no-useless-escape
        .pattern(/^[0-9\/]+$/)
        .required()
        .messages({
            'string.empty': 'id tag manquant',
            'string.pattern.base': 'erreur sur le format des tag id'
        }),
        
    title:Joi.string()
        .pattern(/^[^ ][a-zA-Z\d*\s]+[^ ]+$/)
        .required()
        .messages({
            'string.empty': 'le titre est obligatoire',
            'string.pattern.base': 'le titre possède uniquement des chiffres et des lettres'
        }),
    content:Joi.string()
        .required()
        .messages({
            'string.empty': 'le contenu de la leçon ne peut pas être vide'
        }),
    /**id utilisateur */
    userId:Joi.any(),
});