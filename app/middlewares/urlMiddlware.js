
const AES = require('../helpers/security/aes');

module.exports = {
    /**
    * récupere le token d'identification du formulaire
    */
    getUrlParameter: async(req, res, next)=>{
        if(!req.body.userId || !req.body.data){
            throw ({message: 'vous n\'êtes pas autorisé à éxecuter cette action', statusCode:'403'});
        }

        /** decryptage des token */
        const aes = new AES();

        /** décodage base64 -> UTF-8 puis décryptage du token req.body */
        const userId =  await aes.decrypt(req.body.userId);

        /** décodage base64 -> UTF-8 puis décryptage du token cookie  */
        const data =  await aes.decrypt(req.body.data);

        const userToken = data.split('|');
       
        if(userToken.length !== 2){ 
            throw ({message: 'vous n\'êtes pas autorisé à éxecuter cette action', statusCode:'403'});                   
        }

        /**recuperation secret code */
        const secret = process.env.SECRET_URL_WORD;

        const secretCode = secret.split('|');

        if(secretCode.length !== 2){
            throw ({message: 'vous n\'êtes pas autorisé à éxecuter cette action', statusCode:'403'});
        }

        if((parseInt(userId,10) !== parseInt(userToken[0],10)) || (userToken[1] !== secretCode[1])){
            throw ({message: 'vous n\'êtes pas autorisé à éxecuter cette action', statusCode:'403'});
        }
        req.userId = parseInt(userId,10);
        
        next();
    }
};