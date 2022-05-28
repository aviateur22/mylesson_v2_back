
const jsonwebtoken = require('jsonwebtoken');
const AES = require('./aes');

module.exports = {
    /**
     * comparaison token client et token présent dans un jwt
     * @param {Object} jwt - jwt possédant le token 
     * @param {Object} tokenClient - token coté client a comparer 
     */
    compareToken: async(jwt, tokenClient, secretClient) => {
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }
       
        /** token injecté */
        if(!tokenClient || !secretClient){
            throw ({message: 'vous n\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }

        /** jwt contenant le token */
        if(!jwt){
            throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }

        return await jsonwebtoken.verify(jwt, KEY, async function(err, payload) {
            if(err){
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }                     

            /** token absent */
            if(!payload.data?.token || !payload.data?.secret){
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            } 

            /** token du jwt */
            const token = payload.data.token;

            /** secret du jwt */
            const secret = payload.data.secret;

            /** decryptage des token */
            const aes = new AES();

            /** décodage base64 -> UTF-8 puis décryptage du token req.body */
            const tokenClientDecrypt =  await aes.decrypt(tokenClient);

            /** décodage base64 -> UTF-8 puis décryptage du secret req.body */
            const secretClientDecrypt =  await aes.decrypt(secretClient);

            /** décodage base64 -> UTF-8 puis décryptage du token cookie  */
            const tokenDecrypt =  await aes.decrypt(token);

            /** décodage base64 -> UTF-8 puis décryptage du secret cookie  */
            const secretDecrypt =  await aes.decrypt(secret);

            /**verification cohérence token non décrypté */            
            if(tokenClientDecrypt !== tokenDecrypt || secretClientDecrypt !== secretDecrypt){
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }
            return true;
        });
    },

    compareTokenWithSecret: async(jwt, tokenClient) => {
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }
       
        /** token injecté */
        if(!tokenClient){
            throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }

        /** jwt contenant le token */
        if(!jwt){
            throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }
        
        return await jsonwebtoken.verify(jwt, KEY, async function(err, payload) { 
            if(err){
                throw ({message: 'vous n\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }    
            /** token du jwt */
            const token = payload.data?.token;

            if(!token){                
                throw ({message: 'vous n\'êtes pas autorisé à éxecuter cette action demandée', statusCode:'403'});
            }

            /** decryptage des token */
            const aes = new AES();

            /** décodage base64 -> UTF-8 puis décryptage du token req.body - contient le token aléatoire */            
            const tokenClientDecrypt =  await aes.decrypt(tokenClient);

            /** décodage base64 -> UTF-8 puis décryptage du token jwt.data.token - contient le code secret | token aléatoire (non chiffré)*/
            const jwtTokenDecrypt = await aes.decrypt(token);

            /**séparation du JWTtokenDecrypt avec le signe | */
            const jwtTokenArray = jwtTokenDecrypt.split('|');

            if(jwtTokenArray.length !== 2){ 
                throw ({message: 'vous n\'êtes pas autorisé à éxecuter cette action demandée', statusCode:'403'});                   
            }
    
            // /** Récupération codeSecret + token depuis le JWT  */
            const secretWordDecrypt = aes.decrypt(jwtTokenArray[0]);
            const tokenDecrypt = jwtTokenArray[1];

            /** récupération mot secret de l'appication */
            const secretWord = process.env.SECRET_APP_WORD;

            //comparaison du secret word et du token aéatoire
            if(secretWordDecrypt!== secretWord || tokenDecrypt !== tokenClientDecrypt){
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }
            return true;                
        });
    },

    /**
     * Comparaison token et JWT.token sans présence de mot secret
     * @param {*} jwt - JWT
     * @param {*} tokenClient - token chiffré AES
     */
    compareTokenWithoutSecret: async(jwt, tokenClient) =>{
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }
       
        /** token injecté */
        if(!tokenClient){
            throw ({message: 'vous n\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }

        /** jwt contenant le token */
        if(!jwt){
            throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }

        return await jsonwebtoken.verify(jwt, KEY, async function(err, payload) {
            if(err){
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }                     

            /** token absent */
            if(!payload.data?.token){
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            } 

            /** token du jwt */
            const token = payload.data.token;

            /** decryptage des token */
            const aes = new AES();

            /** décodage base64 -> UTF-8 puis décryptage du token req.body */
            const tokenClientDecrypt =  await aes.decrypt(tokenClient);         

            /** décodage base64 -> UTF-8 puis décryptage du token cookie  */
            const tokenDecrypt =  await aes.decrypt(token);          

            /**verification cohérence token non décrypté */            
            if(tokenClientDecrypt !== tokenDecrypt){
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }
            return true;
        });
    }
};