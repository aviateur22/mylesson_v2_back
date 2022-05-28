/**
 * genration d'un jwt à la connexion client
 */
const jsonWebtoken = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AES = require('../security/aes');

class JWT{
    constructor(expiresIn){
        /**durée de validitée du token */
        this.expiresIn = expiresIn;
    }

    /**
     * génération d'un JWT
     * @param {Object} data - payload pour le jwt 
     * @returns 
     */
    generateJwt(data){
        /** données de base pour le token*/
        const issuer = 'back-auth-myLesson';

        //sujet
        const subject = 'authorization';

        //uuid du token
        const jwtid = uuidv4();

        //temps avant expiration défini dans les parametres
    
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }

        /** génération JWT sans token */
        const jwt = jsonWebtoken.sign({               
            data
        }, KEY, {
            algorithm: 'HS256',
            issuer: issuer,
            subject: subject,
            jwtid: jwtid,
            expiresIn: this.expiresIn
        });
        return jwt;
    }

    /**
     * génération d'un JWT avec en payload un token aléatoire et un tokenSecret
     * token:  TEXT aléatoire
     * tokenSecret: SECRET 
     */
    async generateToken(){
        /**AES */
        const aes =new AES();

        /**token aléatoire */
        const token = await aes.encrypt(uuidv4());

        /**secret  */
        const secret = await aes.encrypt(process.env.SECRET_APP_WORD);

        /**génération d'un jwt avec payload */
        const jwt = this.generateJwt({ token, secret });

        return ({jwt, token, secret});     
    }

    /**
     * génration d'un JWT avec en payload un token 
     * le token: SECRET | TEXT aléatoire
     * @returns 
     */
    async generateTokenWithSecretWord(){
        const aes =new AES();

        /**text aléatoire */
        const uuid = uuidv4();

        /**chiffrage du uuid */
        const uuidEncrypt = await aes.encrypt(uuid);

        /**secret  */
        const secret =aes.encrypt(process.env.SECRET_APP_WORD);

        /**composition token aléatoier avec secret word */
        const token =await aes.encrypt(secret + '|' + uuid);

        /**génération d'un jwt avec payload */
        const jwt = this.generateJwt({ token });

        return { jwt, token: uuidEncrypt };
    }
}
module.exports = JWT;