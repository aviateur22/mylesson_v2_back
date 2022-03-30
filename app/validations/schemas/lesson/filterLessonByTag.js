/**
 * schéma de validation pour filter les lecons
 */

const Joi = require('joi');
module.exports = Joi.object({    
    /** tag - non utilisé */
    tags: Joi.array()
        .items(Joi.number())
        .required()        
});