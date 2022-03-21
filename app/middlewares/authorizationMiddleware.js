/**
 * recuperation du JWT et du payload associée
 */
const jsonwebtoken = require('jsonwebtoken');
module.exports = (req, res, next)=>{    
    /**Recupération des cookies */    
    if(!req.cookie){
        throw ({message: 'pas de token d\'identification', statusCode:'401'});
    }    
    
    /** récupération cookie authorization */
    if(!req.cookie.authorization){
        throw ({message: 'pas de token d\'identification', statusCode:'401'});
    }

    /** récupération cookie authorization */
    const authorizationToken = req.cookie.authorization;  
    
    //clé secrete
    const KEY = process.env.JWT_PRIVATE_KEY;

    if(!KEY){
        throw ({message: 'KEY token absente', statusCode:'500'});
    }

    jsonwebtoken.verify(authorizationToken, KEY, function(err, payload) {        
        if(err){
            throw ({message: 'votre session a expirée', statusCode:'401'});
        }
        req.payload = payload;
        return next();
    });
};