const CRYPTO_AES = require('../helpers/security/aes');
const aes = new CRYPTO_AES();

/**
 * Verification identité utilisateur par token
 * @returns 
 */
module.exports = async(req, res, next) => {
    /**vérification de l'id utilisateur */
    if(!req.session?.user?.id || !req.session?.user?.token){            
        throw ({message: 'identity sessionid non trouvé', statusCode:'401', resetAuth: true , redirect :'/', error: true});
    }

    /**récuperation de id utilisateur depuis le header*/
    const userId = req.headers['user-ident'];

    if(!userId){
        throw ({message: 'identity userId absent de la requête', statusCode:'401', resetAuth: true , redirect :'/', error: true});
    }

    const decryptUserId = aes.decrypt(userId);
    const sessionId = `userid:${req.session.user.id}`;

    /**verification de l'id et session.id */
    const idCompare = decryptUserId === sessionId ? true : false;

    if(!idCompare){
        throw ({message: 'identity id invalide', statusCode:'401', resetAuth: true , redirect :'/', error: true});
    }          
    
    /**verification du token utilisateur */
    if(!res.cookie){
        throw ({message: 'aucun cookie', statusCode:'401', resetAuth: true , redirect :'/', error: true});
    }

    const decryptToken = aes.decrypt(res.cookie.ident);
    const sessionToken = `${req.session.user.id}/${req.session.user.token}`;
    
    /**verification de l'id et session.id */
    const tokenCompare = decryptToken === sessionToken ? true : false;

    if(!tokenCompare){
        throw ({message: 'identity token invalid', statusCode:'401', resetAuth: true , redirect :'/', error: true});
    }
    delete res.cookie;
    next();        
};