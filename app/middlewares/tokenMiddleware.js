/**
 * Récupération des JWT - token 
 * Création de JWT - token 
 */
const compareToken = require('../helpers/security/tokenCompare');

/**token JWT */
const JWT = require('../helpers/security/jwt');

/** JWT expires in */
const jwtExpireIn = require('../helpers/jwtExpire');

module.exports = {
    /**
     * Vérification token avec token du JWT pour les personnes qui sont authentifiées
     */
    getFormToken: async(req, res, next)=>{
        /**Recupération des cookies */    
        if(!req.cookie){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }    
        
        /** récupération du cookie de token */
        if(!req.cookie.auth_token){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }   
        
        /** token depuis la requete */
        const reqToken = req.body.token;       
        const reqSecret = req.body.secret;  

        /** token de la requete absent */
        if(!reqToken || !reqSecret){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }

        /** récupération cookie authorisation formulaire */
        const cookieToken = req.cookie.auth_token;  

        const compare =  await compareToken.compareToken(cookieToken, reqToken, reqSecret);

        if(!compare){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }
        return next();
    },

    /**
     * Vérification token avec token du JWT pour les personnes qui ne sont pas authentifiées
     */
    getVisitortoken: async(req,res,next)=>{
        /**Recupération des cookies */   
        
        if(!req.cookie){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }    
        
        /** récupération du cookie de token */
        if(!req.cookie.visitor_auth){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }   
        
        /** token depuis la requete */
        const reqToken = req.body.token;  

        /** token de la requete absent */
        if(!reqToken){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }

        /** récupération cookie authorisation formulaire */
        const cookieToken = req.cookie.visitor_auth;  

        /**comparaiosn du token dans le JWT et le token du client*/        
        const compare =  await compareToken.compareTokenWithSecret(cookieToken, reqToken);

        if(!compare){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }

        return next();
    },

    /**
     * middleware pour génération d'un token pour une personne connecté
     * Ce middleware transfert le dataToken et le JWT dans res
     * pour pouvoir être récupérer par le controller* 
     */
    setFormToken: async(req, res, next)=>{            
        const jwt = new JWT(jwtExpireIn.std.expiresIn);

        const data = await jwt.generateToken();        
        
        /** token JWT pour le cookie  */
        const jwtGen = data.jwt;

        /** vérification présence token et secret token our le formulaire */
        if(!data.token || !data.secret){           
            throw ({message: 'erreur dans la création des tokens', statusCode:'400'});
        }

        /** transfert des tokens dans la réponse */
        res.dataToken = {
            token: data.token,
            secret: data.secret
        };
        
        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('auth_token', jwtGen, { sameSite:'none', secure: true, httpOnly: true });

        return next();
    }
};