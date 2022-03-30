/**
 * schéma d'ajout d'un nouveau link utilisateur
 */
const Joi = require('joi');
module.exports = Joi.object({      
    linkUrl: Joi.string()
        // eslint-disable-next-line no-useless-escape
        .pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
        .messages({   
            'string.pattern.base': 'le format de votre url de linkedin est incorrecte',           
            'string.empty': 'le lien http est obligatoire pour l\'ajout du link',
            'any.required': 'le lien http est obligatoire pour l\'ajout du link',
        }),    
    mediaId: Joi.number()
        .required()
        .messages({
            'string.empty': 'absence de données sur la compagnie',
            'any.required': 'absence de données sur la compagnie',
        })
});
