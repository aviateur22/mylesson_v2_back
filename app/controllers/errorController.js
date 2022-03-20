/**
 * Gestion des erreurs
 * @param {Object} err - erreur envoyé
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 * @returns {Object} - API JSON response status
 */
const logger = require('../helpers/logger');
module.exports = (err, req, res, next)=>{
    try {
        /**erreur dans les données de l'erreur */
        if(!err.message || !err.statusCode){            
            logger.error(err);
            /**erreur non managé*/
            return res.status(500)
                .json({      
                    'error' : true,
                    'message':'erreur interne au serveur'
                });    
        } else {
            /**Renvoie de l'erreur */
            return res.status(err.statusCode)
                .json({      
                    'error' : true,
                    'message':err.message
                });
        }
    } catch (error) {
        console.log(error);        
    }    
};