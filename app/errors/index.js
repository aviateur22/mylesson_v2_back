/**
 * Gestion des erreurs
 * @param {Object} err - erreur envoyé
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 * @returns {Object} - API JSON response status
 */
module.exports = (err, req, res, next)=>{
    try {
        /**erreur dans les données de l'erreur */
        if(!err.message || !err.statusCode || !err.error || !err.redirect){
            throw 'données sur l\'erreur incomplète';   
        }      

        /**Renvoie de l'erreur */
        return res.status(err.statusCode)
            .json({               
                'redirect':err.redirect,                
                'error' : err.error,
                'message':err.message
            });        
    } catch (error) {
        console.log(error);        
    }    
};