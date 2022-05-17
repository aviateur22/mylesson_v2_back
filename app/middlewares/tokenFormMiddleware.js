const compareToken = require('../helpers/security/tokenCompare');

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

        /** token depuis la requete */
        const reqFormToken = req.body.formToken;       

        /** token de la requete absent */
        if(!reqFormToken){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }

        /** récupération cookie authorisation formulaire */
        const formAuthorizationToken = req.cookie.form_token;  

        const compare = compareToken.compareToken(formAuthorizationToken, reqFormToken);

        if(!compare){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }
        return next();
    },

    /**
     * création d'un token
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