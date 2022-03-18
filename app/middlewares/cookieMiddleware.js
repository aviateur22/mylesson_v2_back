/**
 * récuperation des cookies
 * @param {*} cookieSchemaError - traitement des erreurs sur les cookies
 * @returns {Object} req.cookie - renvoie un objet cookie
 */
module.exports = (req,res,next)=>{    
    /**object pour stocker les cookies */
    const list = {};

    /**recuperation des cookies */
    const cookieHeader = req.headers?.cookie;  

    /**pas de presence de cookie */
    if(!cookieHeader){
        throw ({message: 'absence autorisation cookie', statusCode:'401', resetAuth: true , redirect :'/', error: true});
    }

    /**mise des cookies dans l'objet */
    cookieHeader.split(';').forEach(function(cookie) {
        let [ name, ...rest] = cookie.split('=');
        name = name?.trim();
        if(!name) {
            throw ({message: 'erreur format autorisation cookie', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        const value = rest.join('=').trim();
        if(!value){
            throw ({message: 'erreur format autorisation cookie', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        list[name] = decodeURIComponent(value);
    });
    res.cookie = list;
    console.log(list)
    next();
};