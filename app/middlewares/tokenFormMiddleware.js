
const jsonwebtoken = require('jsonwebtoken');

/**token JWT */
const jwtToken = require('../helpers/security/jwt');

module.exports = {
    /**
    * récupere le token d'identification du formulaire
    */
    getFormToken: (req, res, next)=>{
        /**Recupération des cookies */    
        if(!req.cookie){
            throw ({message: 'oups token du formulaire invalide', statusCode:'403'});
        }    
        
        /** récupération cookie authorization */
        if(!req.cookie.form_token){
            throw ({message: 'oups token du formulaire invalide', statusCode:'403'});
        }


        /** récupération cookie authorisation formulaire */
        const formAuthorizationToken = req.cookie.form_token;  
        
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }

        jsonwebtoken.verify(formAuthorizationToken, KEY, function(err, payload) {        
            if(err){
                throw ({message: 'oups token du formulaire invalide', statusCode:'403'});
            }

            /** token formulaire du JWT */
            const token = payload;
            

            /** token absent */
            if(!token.formToken){
                throw ({message: 'oups token du formulaire invalide', statusCode:'403'});
            }
         
            /** token depuis la requete */
            const reqFormToken = req.body.formToken;          
            /** token de la requete absent */
            if(!reqFormToken){
                throw ({message: 'oups token du formulaire invalide', statusCode:'403'});
            }

            /**verification entre le token du formulaire et le token du cookie */            
            if(reqFormToken != token.formToken){
                throw ({message: 'oups token du formulaire invalide', statusCode:'403'});
            }
            return next();
        });
    },

    /**
     * création d'un token pour un formulaire
     */
    setFormToken: async(req, res, next)=>{             
        /** génération token pour un formulaire*/
        const ResultToken = await jwtToken({form: true});
        
        /** token JWT pour le cookie  */
        const cookieJWT = ResultToken.token;

        /** Token brut pour le formulaire */
        const reqToken = ResultToken.formToken;

        /** transfert le roken dans la réponse */
        res.formToken = reqToken;
        
        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('form_token', cookieJWT, { sameSite:'none', secure: true, httpOnly: true });

        return next();
    }

};