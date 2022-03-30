/**
 * schéma de mise ajour d'un link utilisateur
 */
const Joi = require('joi');
module.exports = Joi.object({      
    linkUrl:Joi.string()
        /**Espace début et fin interdit - lettre et chiffre ok  */        
        .required()
        .messages({              
            'string.empty': 'le lien http est obligatoire pour l\'ajout du link',
            'any.required': 'le lien http est obligatoire pour l\'ajout du link',
        })
});
