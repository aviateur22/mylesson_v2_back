const session = require('express-session');

let cookie;

if(process.env.SESSION_MINUTES){
    cookie = {
        maxAge: process.env.SESSION_MINUTES * 60 * 1000,
        //Permet de définir que le cookie n'est pas sur le meme domaine.
        //En prod a priori mettre la valueur a sameSite:'none' et secure : 'true'
        sameSite:'lax',
    };
}

const sessionMiddleware = ()=>{
    return session({        
        saveUninitialized:true,
        resave:true,
        secret:process.env.SESSION_SECRET ?? 'hdlfdfMDFDFD5666674123ddkfkjfkjfMFDLKF@df',        
        cookie :cookie
    });
};
module.exports = sessionMiddleware;