
const jsonwebtoken = require('jsonwebtoken');
const AES = require('./aes');

module.exports = {
    /**
     * comparaison token client et token présent dans un jwt
     * @param {Object} jwt - jwt possédant le token 
     * @param {Object} tokenClient - token coté client a comparer 
     */
    compareToken: async(jwt, tokenClient) => {
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }

        /** token injecté */
        if(!tokenClient){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }

        /** jwt contenant le token */
        if(!jwt){
            throw ({message: 'oupsss token invalid', statusCode:'403'});
        }

        return await jsonwebtoken.verify(jwt, KEY, async function(err, payload) {
            if(err){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }                     
            /** token formulaire du JWT */
            const token = payload;

            /** token absent */
            if(!token.formToken){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            } 

            /** token du jwt */
            const jwtToken = token.formToken;

            /** decryptage des token */
            const aes = new AES();

            /** décodage base64 -> UTF-8 puis décryptage du token req.body */
            const tokenClientDecrypt =  await aes.decrypt(tokenClient);

            /** décodage base64 -> UTF-8 puis décryptage du token cookie  */
            const jwtTokenDecrypt =  await aes.decrypt(jwtToken);

            /**verification cohérence token non décrypté */            
            if(tokenClientDecrypt !== jwtTokenDecrypt){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }
            return true;
        });
    },
};