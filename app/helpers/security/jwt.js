/**
 * genration d'un jwt à la connexion client
 */
const jsonWebtoken = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const tokenGenerator = require('./tokenGenerator');

module.exports = async(data)=>{
    /** données de base pour le token*/
    //emeteur
   
    const issuer = 'back-auth-myLesson';
    //sujet
    const subject = 'authorization';
    //uuid du token
    const jwtid = uuidv4();
    //temps avant expiration
    const expTime = '1800s';
    
    /** données manquante pour la génération d'un token */
    if((!data.user && !data.role) && !data.form){
        throw ({message: 'les données envoyées ne permettent pas la génération d\'un token', statusCode:'400', resetAuth: true , redirect :'/', error: true});
    }
   
    //clé secrete
    const KEY = process.env.JWT_PRIVATE_KEY;

    if(!KEY){
        throw ({message: 'KEY token absente', statusCode:'500'});
    }

    /** token */
    let jwtToken;

    /** génération token pour un utilisateur*/
    if(data.user){
        jwtToken = jsonWebtoken.sign({
            userId: data.user,
            role: data.role
        }, KEY, {
            algorithm: 'HS256',
            issuer: issuer,
            subject: subject,
            jwtid: jwtid,
            expiresIn: expTime
        });
        return jwtToken;
    } 
    /** génération token pour un formulaire*/
    else if(data.form){
        /** generztion d'un unique uuid */
        const formTokenGenerator = uuidv4();
        

        /** generzation du token JWT */
        jwtToken = jsonWebtoken.sign({
            formToken: formTokenGenerator
        }, KEY, {
            algorithm: 'HS256',
            issuer: issuer,
            subject: subject,
            jwtid: jwtid,
            expiresIn: '900s'
        });
        return {token: jwtToken, formToken: formTokenGenerator };
    } else {
        throw ({message: 'les données envoyées ne permettent pas la génération d\'un token', statusCode:'400', resetAuth: true , redirect :'/', error: true});
    }
};