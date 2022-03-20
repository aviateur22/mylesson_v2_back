const bcrypt = require('bcrypt');
const { User } = require('../models/index');
const sanitizer = require('sanitizer');
/**role utilisateur */
const userRole = require('../helpers/userRole');

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
    loginAction: async(req, res, _)=>{
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
    registerAction: async(req, res ,_)=> {       
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
    logoutAction:  async(req, res ,_)=> {        
        //const comparePassword = await bcrypt.compare(req.session.user);
        return res.status(200).json({
            'message':'A bientot'
        });            
    },

    /**
     * récupération des info utilisateur
     */
    getUserById: async(req, res, next)=>{
        //récupération de l'utilisateur
        const userId = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'422'});
        }

        /** données utilisateur absent */
        if(!userId){
            throw ({message: 'l\'identifiant utilisateur est manuqant', statusCode:'422'});
        }

        /** Seule un admin ou l'utilisateur peut effectuer cette action */
        if( userId !== parseInt(req.payload.id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'est pas autorisé a executer cette action', statusCode:'403'});
        }

        const user = await User.findByPk(userId);

        /** Pas de données */
        if(!user){
            return res.status(204).json({});
        }

        return res.status(200).json({
            id: user.id,
            login: user.login,
            email: user.email
        });
    },

    /**
     * Update des données d'un utilisateur
     */
    updateUserById: async(req, res, next)=>{
        //récupération de l'utilisateur
        const userId = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'422'});
        }

        /** données utilisateur absent */
        if(!userId){
            throw ({message: 'l\'identifiant utilisateur est manuqant', statusCode:'422'});
        }

        /** Seule un admin ou l'utilisateur peut effectuer cette action */
        if( userId !== parseInt(req.payload.id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'est pas autorisé a executer cette action', statusCode:'403'});
        }

        /** récupération des données */
        const userData = await User.findOne({
            where: {
                id: userId 
            }
        });

        /** pas d'utilisateur */
        if(!userData){
            throw ({message: 'aucun compte associé à cet identifiant ', statusCode:'400'});
        }

        const { email, login } = req.body;

        /** modification de l'email*/
        if(email){
            const user = await User.findOne({
                where: {
                    email:email 
                }
            });

            /** email déja utilisé */
            if(user) {      
                throw ({message: 'cet email est déjà existant', statusCode:'409'});
            }
        }

        /** nouvelles données utilisateur */
        const newUserData = { ...userData, ...{ email: sanitizer.escape(email), login: sanitizer.escape(login)}};
       
        /** mise a jour de l'utilisateur */
        const updateUser = await userData.update({
            ...newUserData            
        });

        return res.status(200).json({
            id: updateUser.id,
            login: updateUser.login,
            email: updateUser.email
        });
    },



    /**
     * Suppresion de un utilisateur
     */
    deleteUserById: async(req ,res, next)=>{
        //récupération de l'utilisateur
        const userId = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'422'});
        }

        /** données utilisateur absent */
        if(!userId){
            throw ({message: 'l\'identifiant utilisateur est manquant', statusCode:'422'});
        }

        /** Seule un admin ou l'utilisateur peut effectuer cette action */
        if( userId !== parseInt(req.payload.id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'est pas autorisé a executer cette action', statusCode:'403'});
        }

        /** utilisateur a supprimer */
        const deleteUser = await User.findByPk(userId);

        /** utilisateur absent de la base de données */
        if(!deleteUser){
            return res.status(204).json({});
        }

        /** suppression utilisatzur */
        await deleteUser.destroy();       

        return res.status(200).json(deleteUser);
    },

    /**
     * Modification du mot de passe
     */
    updatePassword: async(req, res, next)=>{
        //récupération de l'utilisateur
        const userId = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'422'});
        }

        /** données utilisateur absent */
        if(!userId){
            throw ({message: 'l\'identifiant utilisateur est manquant', statusCode:'422'});
        }

        /** Seule un admin ou l'utilisateur peut effectuer cette action */
        if( userId !== parseInt(req.payload.id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'est pas autorisé a executer cette action', statusCode:'403'});
        }

        /** */
        const { password, newPassword, confirmNewPassword }= req.body;

        if(!password || !newPassword || !confirmNewPassword){
            throw ({message: 'données manquantes pour la modification du mot de passe', statusCode:'400'});
        }

        const user = await User.findOne({
            where: {
                id: userId
            }
        });       
        
        /** pas d'utilisateur de trouvé */
        if(!user){
            throw ({message: 'utilisateur absent de la base de données', statusCode:'400'});
        }

        const comparePassword = await bcrypt.compare(password , user.password);

        /** echec comparaiosn mot de passe */
        if(!comparePassword){
            throw ({message: 'votre mot de passe n\'est pas valide', statusCode:'403'}); 
        }

        /** erreur de confirmation de mot de passe */
        if(newPassword !== confirmNewPassword){
            throw ({message: 'erreur de confirmation du nouveau mot de passe', statusCode:'400'});
        }

        /** hash du nouveau mot de passe */
        const passwordHash =await bcrypt.hash(sanitizer.escape(newPassword),10);

        /** nouvelles données utilisateur */
        const newUserPassword = { ...user, ...{ password: passwordHash}};
       

        /** mise a jour du mot de passe */
        const updateUser = await user.update({
            password: passwordHash        
        });

        console.log(updateUser);
        return res.status(200).json({
            id: updateUser.id,
            login: updateUser.login,
            email: updateUser.email
        });
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