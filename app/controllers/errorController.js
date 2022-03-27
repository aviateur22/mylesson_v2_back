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
        if(err.awsError){         
            /** erreur avec AWS */
            /** la methode pour une recupération d'image depuis AWS  ne renvoit pas le text d'erreur. Seul le status est present  */
            /** j apelle la meme méthode depuis la fonction elle meme qui me recupere et affiche le text de l'erreur */
            return res.status(403)
                .json({      
                    'error' : true,
                    'message':err.awsError
                });       
        } else if(!err.message || !err.statusCode){            
            /**erreur non managé*/
            logger.error(err);            
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
        /**erreur non managé*/
        logger.error(error);  
        console.log('dans le catch de errorController');        
        return res.status(500)
            .json({      
                'error' : true,
                'message':'erreur interne au serveur'
            });       
    }    
};