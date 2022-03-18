const bcrypt = require('bcrypt');
const urlRedirect = require('../enums/urlRedirection');
const { User } = require('../models/index');

/**Security */
const CRYPTO_AES = require('../helpers/security/aes');
const tokenGenerator = require('../helpers/security/tokenGenerator');



const userController={
    /**
     * Connexion
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     * @returns {Object} -API JSON response status
     */
    loginAction: () => async(req, res, _)=>{
        if(!req.body.email || !req.body.password) {
            throw ({message: 'email et mot de passe obligatoire', statusCode:'422', resetAuth: true , redirect :'/', error: true});
        }    

        const user = await User.findOne({
            where: {
                email:req.body.email 
            }
        });       

        if(!user){
            throw ({message: 'erreur dans l\'email ou le mot de passe', statusCode:'422', resetAuth: true , redirect :'/', error: true});
        }

        const comparePassword = await bcrypt.compare(req.body.password , user.password);

        if(!comparePassword){
            throw ({message: 'erreur dans l\'email ou le mot de passe', statusCode:'422', resetAuth: true , redirect :'/', error: true}); 
        }

        const { id, role_id, login } = user;    
        
        /**generation d'un token aléatoire */
        const userToken = await tokenGenerator(16);
        
        /** Mise en session des information de connection */            
        req.session.user = {
            'id': id,
            'role_id': role_id,
            'token': userToken
        };

        /**initialisation chiffrement AES */
        const aes = new CRYPTO_AES();
        /** chiffrement de id et du token */
        const identTokenEncrypt = await aes.encrypt(`${id}/${userToken}`);     
               

        /** chiffrement du login et  id utilisateur*/       
        const idEncrypt =await aes.encrypt(`userid:${id}`);
        const loginEncrypt = await aes.encrypt(login);

        /**
         * Renvoie un cookie avec ID hashé de l'utilisateur des infos utilisateurs
         */
        res.cookie('ident', identTokenEncrypt, {sameSite:'lax', path: '/',expires: new Date(Date.now() + 24 * 60 * 60 *1000), httpOnly: true });
        //res.cookie('nom','cyrille',{path: '/',expires: new Date(Date.now() + 24 * 60 * 60 *1000), httpOnly: true })
        res.status(200).json({
            'succes':true,
            'message':`Bienvenu sur votre compte ${login}`,
            'redirect':urlRedirect.myAccount,
            'user' : loginEncrypt,
            'id': idEncrypt,
            'role' : role_id
        });        
    },
    
    /**
     * Inscription
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     * @returns  {Object} - API JSON response status
     */
    signupAction :() => async(req, res ,_)=> {       
        const {login, email, password} = req.body;
        if(!login || !email || !password) {    
            throw ({message: 'email, mot de passe et confirmation du mot de passe obligatoire', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }    

        const user = await User.findOne({
            where: {
                email:email 
            }
        });       

        if(user) {      
            throw ({message: 'cet email est déjà existant', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }
        
        const passwordHash =await bcrypt.hash(password,10);

        await User.create({
            login: login,
            email : email,
            password : passwordHash,
            token : 'fhdfkhdkdfkdflkddfh'
        });            
        
        return res.status(200).json({ 
            'succes':true,           
            'redirect':urlRedirect.login,
            'message':'Felication votre inscription est réussi'
        });
    },

    /**
     * Déconnecxion
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     * @returns {Object} - API JSON response status
     */
    logoutAction :  async(req, res ,_)=> {
        //desturction de la session
        req.session.destroy;
        req.session=null;
        
        //const comparePassword = await bcrypt.compare(req.session.user);
        return res.status(200).json({
            'succes':true,
            'message':'A bientot',
            'redirect':urlRedirect.home,
        });            
    },

    /**
     * récupération de un user 
     */
    getOne : async(req, res, next)=>{

    },

    /**
     * Update de un utilisateur
     */
    update: async(req, res, next)=>{

    },

    /**
     * Suppresion de un utilisateur
     */
    delete : async(req ,res, next)=>{
    }
};

module.exports = userController;