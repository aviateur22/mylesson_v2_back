const bcrypt = require('bcrypt');
const { User } = require('../models/index');

/**  */
const jwtToken = require('../helpers/security/jwt');

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
            throw ({message: 'email et mot de passe obligatoire', statusCode:'422'});
        }    

        const user = await User.findOne({
            where: {
                email:req.body.email 
            }
        });       
        
        /** pas d'utilisateur de trouvé */
        if(!user){
            throw ({message: 'email ou mot de passe invalide', statusCode:'422'});
        }

        const comparePassword = await bcrypt.compare(req.body.password , user.password);

        /** echec comparaiosn mot de passe */
        if(!comparePassword){
            throw ({message: 'email ou mot de passe invalide', statusCode:'422'}); 
        }

        const { id, role_id, login } = user;        
       
        /** génération token */
        const token = await jwtToken({user: id, role: role_id});
        
        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('authorization', token, {sameSite:'lax', httpOnly: true });       

        // /** Renvoie un cookie avec ID hashé de l'utilisateur des infos utilisateurs */
        //res.cookie('ident', identTokenEncrypt, {sameSite:'lax', path: '/',expires: new Date(Date.now() + 24 * 60 * 60 *1000), httpOnly: true });       

        //res.cookie('nom','cyrille',{path: '/',expires: new Date(Date.now() + 24 * 60 * 60 *1000), httpOnly: true })
        res.status(200).json({
            'message':`Bienvenu sur votre compte ${login}`,            
            'user' : login,
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
    registerAction :() => async(req, res ,_)=> {       
        const {login, email, password, confirmPassword} = req.body;

        if(!login || !email || !password || !confirmPassword) {    
            throw ({message: 'email, mot de passe et confirmation du mot de passe obligatoire', statusCode:'422'});
        }    

        /** Mot de passe et confirmation mot de passe pas identique */
        if(password !== confirmPassword){
            throw ({message: 'les mots de passe ne sont pas identique', statusCode:'422'});
        }
        const user = await User.findOne({
            where: {
                email:email 
            }
        });
        if(user) {      
            throw ({message: 'cet email est déjà existant', statusCode:'409'});
        }
        
        const passwordHash =await bcrypt.hash(password,10);

        await User.create({
            login,
            email,
            password : passwordHash
        });            
        
        return res.status(200).json({ 
            'message':'Felication votre inscription est réussi'
        });
    },

    /**
     * Déconnexion
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
            'message':'A bientot'
        });            
    },

    /**
     * récupération de un user 
     */
    getUserById : async(req, res, next)=>{

    },

    /**
     * Update de un utilisateur
     */
    updateUserById: async(req, res, next)=>{

    },

    /**
     * Suppresion de un utilisateur
     */
    deleteUserById : async(req ,res, next)=>{
    },

    /**
     * récupration de tous les utilisateurs
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getAllUser: async(req ,res, next)=>{
    }

};

module.exports = userController;