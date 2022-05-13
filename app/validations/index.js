/**
 * Joi Validator
 * @param {Object} schema - schéma de données a valider
 * @returns {object} - next si validation OK ou error
 */
module.exports = (schema) =>async(req, res, next) =>{
    try {
        await schema.validateAsync(req.body);
        next();        
    } catch (error) {           
        next({message: error.message, statusCode:'400'});
    }
};