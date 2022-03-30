/**
 * schéma d'ajout d'un nouveau link utilisateur
 */
const Joi = require('joi');
module.exports = Joi.object({      
    linkUrl:Joi.string()
        .required()
        .messages({              
            'string.empty': 'le lien http est obligatoire pour l\'ajout du link',
            'any.required': 'le lien http est obligatoire pour l\'ajout du link',
        })
});
