/**token JWT */
const JWT = require('../helpers/security/jwt');
const jsonwebtoken = require('jsonwebtoken');

const tokenController = {   
    
    /**
     * Genration d'un token pour les personne authentifiée
     * @param {text} expiresIn - durée de validitée du token
     * @returns 
     */
    generateToken:(expiresIn)=>async(req, res, next)=>{
        /**instanciation JWT avec la durée de validitée */
        const jwt = new JWT(expiresIn);

        /** récuperation d'un JWT + token chiffré */
        const data = await jwt.generateToken();

        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('auth_token', data.jwt, { sameSite:'none', secure: true, httpOnly: true });   

        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        jsonwebtoken.verify(data.jwt, KEY, function(err, payload) {        
            if(err){
                throw ({message: 'votre session a expirée', statusCode:'401'});
            }
            req.payload = payload;
        });

        return res.status(201).json({
            dataToken: {
                secret: data.secret,
                token: data.token

            } 
        });
    },

    /**
     * Génération d'un token pour les personne non connecté a l'application
     * @param {Text} expiresIn - Durée de validitée du token
     * @returns 
     */
    generateVisitorToken:(expiresIn)=>async(req, res, next)=>{
        /**instanciation JWT avec la durée de validitée */
        const jwt = new JWT(expiresIn);

        /** récuperation d'un JWT + token chiffré */
        const data = await jwt.generateTokenWithSecretWord();

        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('visitor_auth', data.jwt, { sameSite:'none', secure: true, httpOnly: true });   

        return res.status(201).json({
            dataToken: {
                token: data.token
            } 
        });
    }
};
module.exports = tokenController;