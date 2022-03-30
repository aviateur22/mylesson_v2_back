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
            /** 
             * erreur avec AWS
             */
            
            /** Enregistrement de l'erreur */
            logger.error(err); 

            return res.status(500)
                .json({      
                    'error' : true,
                    'message':err.awsError
                });       
        } 
        else if(!err.message || !err.statusCode){            
            /**
             * erreur non managé
             */

            /** Enregistrement de l'erreur */
            logger.error(err);            
            return res.status(500)
                .json({      
                    'error' : true,
                    'message':'erreur interne au serveur'
                });
        } else if(Number(err.statusCode) === 500){
            /**
             * Erreur prévu dans le code
             * ne devant normalement pas se prodiure
             */

            /** mise a jour du log d'erreur */
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
        return res.status(500)
            .json({      
                'error' : true,
                'message':'erreur interne au serveur'
            });       
    }    
};