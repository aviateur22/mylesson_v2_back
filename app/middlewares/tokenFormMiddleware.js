
const jsonwebtoken = require('jsonwebtoken');
const AES = require('../helpers/security/aes');

/**token JWT */
const jwtToken = require('../helpers/security/jwt');

module.exports = {
    /**
    * récupere le token d'identification du formulaire
    */
    getFormToken: async(req, res, next)=>{
        /**Recupération des cookies */    
        if(!req.cookie){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }    
        
        /** récupération cookie authorization */
        if(!req.cookie.form_token){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }    

        /** récupération cookie authorisation formulaire */
        const formAuthorizationToken = req.cookie.form_token;  
        
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }

       

        await jsonwebtoken.verify(formAuthorizationToken, KEY, async function(err, payload) {
            if(err){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }                     
            /** token formulaire du JWT */
            const token = payload;            

            /** token absent */
            if(!token.formToken){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }         
            
            /** token depuis la requete */
            const reqFormToken = req.body.formToken;       

            /** token de la requete absent */
            if(!reqFormToken){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }

            /**verification cohérence token non décrypté */            
            if(reqFormToken != token.formToken){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }
            
            /** decryptage des token */
            const aes = new AES();

            /** décodage base64 -> UTF-8 puis décryptage du token req.body */
            const reqBodyToken =  await aes.decrypt(reqFormToken);

            /** décodage base64 -> UTF-8 puis décryptage du token cookie  */
            const cookieToken =  await aes.decrypt(token.formToken);

            /**verification cohérence token non décrypté */            
            if(reqBodyToken != cookieToken){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }
            
            return next();
        });
    },

    /**
     * création d'un token pour un formulaire
     */
    setFormToken: async(req, res, next)=>{             
        /** génération token pour un formulaire*/
        const resultToken = await jwtToken({form: true});
        
        /** token JWT pour le cookie  */
        const cookieJWT = resultToken.token;

        /** Token brut pour le formulaire */
        const reqToken = resultToken.formToken;

        /** transfert le roken dans la réponse */
        res.formToken = reqToken;
        
        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('form_token', cookieJWT, { sameSite:'none', secure: true, httpOnly: true });

        return next();
    }
};