/**
 * schéma d'ajout d'un nouveau link utilisateur
 */
const Joi = require('joi');
module.exports = Joi.object({      
    linkUrl: Joi.string()
        // eslint-disable-next-line no-useless-escape
        .pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
        .messages({   
            'string.pattern.base': 'le format de votre url est incorrecte',           
            'string.empty': 'votre url est obligatoire pour l\'ajout du link',
            'any.required': 'votre url est obligatoire pour l\'ajout du link',
        }),    
    mediaId: Joi.number()
        .required()
        .messages({
            'string.empty': 'absence de données sur la compagnie',
            'any.required': 'absence de données sur la compagnie',
        })
});
