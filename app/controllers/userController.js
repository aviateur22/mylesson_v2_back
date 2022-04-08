const bcrypt = require('bcrypt');
const { User, Link, UserLink } = require('../models/index');
const sanitizer = require('sanitizer');

/**role utilisateur */
const userRole = require('../helpers/userRole');

/**token JWT */
const jwtToken = require('../helpers/security/jwt');

/** aws pour le download */
const awsManager = require('../helpers/aws');

const userController={
    /**
     * Connexion
     */
    login: async(req, res, _)=>{
        if(!req.body.email || !req.body.password) {
            throw ({message: 'email et mot de passe obligatoire', statusCode:'400'});
        }    

        const user = await User.findOne({
            where: {
                email:req.body.email 
            }
        });       
        
        /** pas d'utilisateur de trouvé */
        if(!user){
            throw ({message: 'email ou mot de passe invalide', statusCode:'400'});
        }

        const comparePassword = await bcrypt.compare(req.body.password , user.password);

        /** echec comparaiosn mot de passe */
        if(!comparePassword){
            throw ({message: 'email ou mot de passe invalide', statusCode:'400'}); 
        }
       
        /** génération token */
        const token = await jwtToken({user: user.id, role: user.role_id});
        
        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('authorization', token, { secure: true, sameSite:'none', httpOnly: true });       

        // /** Renvoie un cookie avec ID hashé de l'utilisateur des infos utilisateurs */
        //res.cookie('ident', identTokenEncrypt, {sameSite:'lax', path: '/',expires: new Date(Date.now() + 24 * 60 * 60 *1000), httpOnly: true });       

        //res.cookie('nom','cyrille',{path: '/',expires: new Date(Date.now() + 24 * 60 * 60 *1000), httpOnly: true })
        res.status(200).json({
            'message':`Bienvenu sur votre compte ${user.login}`,            
            'user' : user.login,
            'role' : user.role_id,
            'id' : user.id
        });        
    },
    
    /**
     * Inscription
     */
    register: async(req, res ,_)=> {       
        const {login, email, password, confirmPassword} = req.body;

        if(!login || !email || !password || !confirmPassword) {    
            throw ({message: 'email, mot de passe et confirmation du mot de passe obligatoire', statusCode:'400'});
        }    

        /** Mot de passe et confirmation mot de passe pas identique */
        if(password !== confirmPassword){
            throw ({message: 'les mots de passe ne sont pas identique', statusCode:'400'});
        }

        let user = await User.findOne({
            where: {
                email: email 
            }
        });

        if(user) {      
            throw ({message: 'cet email est déjà existant', statusCode:'409'});
        }
        
        /** vérification login */
        user = await User.findOne({
            where: {
                login: login
            }
        });

        console.log(user);

        /** login utilisé */
        if(user) {      
            throw ({message: 'ce login est déjà existant', statusCode:'409'});
        }

        const passwordHash =await bcrypt.hash(password,10);

        await User.create({
            login,
            email,
            password : passwordHash,
            avatar_key: process.env.DEFAULT_AVATAR
        });            
        
        return res.status(200).json({ 
            'message':'Felication votre inscription est réussi'
        });
    },

    /**
     * Déconnexion
     */
    logout:  async(req, res ,_)=> {        
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
        const userId = req.userId;

        /** si pas de id */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }        

        /**recuperation des infos utilisateur ainsi que ses links */
        const user = await User.findByPk(userId,
            {
                include:'links'
            });        

        /** Pas de données */
        if(!user){
            return res.status(204).json({});
        }

        const token = res.formToken;
       
        return res.status(200).json({
            id: user.id,
            login: user.login,
            email: user.email,
            sex: user.sex,
            avatarKey: user.avatar_key,
            links: user.links,
            token
        });
    },

    /**
     * Récuperation de l'image avatar 
     */
    getAvatarByKey: async(req, res, next)=>{
        //récupération de l'utilisateur
        const avatarKey = req.params.key;    
       
        /** données utilisateur absent */
        if(!avatarKey){
            throw ({message: 'l\'identififiant de l\'image est manquant', statusCode:'400'});
        }
        
        /** données binaire de l'image */
        const downloadImage = await awsManager.BucketDownloadFile(avatarKey);      

        /** erreur dans la réponse */
        if(downloadImage.awsError){                       
            throw {awsError: downloadImage.awsError };
        }
        res.send(downloadImage);            
    },
    
    /**
     * Update des données d'un utilisateur
     */
    updateUserById: async(req, res, next)=>{
        //récupération de l'utilisateur
        const userId = req.userId;

        /** si pas de id */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** récupération des données */
        const userData = await User.findOne({
            where: {
                id: userId 
            },
            include:['links']
        });

        /** pas d'utilisateur */
        if(!userData){
            throw ({message: 'aucun compte associé à cet identifiant', statusCode:'400'});
        }

        const { email, login, sex } = req.body;

        /** verification du sex */
        if(sex !=='homme' && sex !== 'femme'){
            throw ({message: 'le format du sex n\'est pas valide', statusCode:'400'});
        }

        /** modification de l'email*/
        if(email){
            const user = await User.findOne({
                where: {
                    email: email 
                }
            });
            

            /** email déja utilisé si id utilisateur different */
            if(user && Number(user.id) !== Number(userId)) {      
                throw ({message: 'cet email est déjà existant', statusCode:'409'});
            }
        }

        /** nouvelles données utilisateur */
        const newUserData = { ...userData, ...{ email: sanitizer.escape(email), login: sanitizer.escape(login), sex: sex ? sanitizer.escape(sex): null }};
       
        /** mise a jour de l'utilisateur */
        await userData.update({
            ...newUserData
        });      

        return res.status(200).json({            
            id: userData.id,
            login: userData.login,
            email: userData.email,
            avatarKey: userData.avatar_key,
            sex: userData.sex,
            usersLinks: userData.usersLinks,
            token: req.body.formToken
        });
    },

    /**
     * Mise a jour d'une image utilisateur
     */
    updateImageByUserId: async(req, res, next)=>{
        //récupération de l'utilisateur
        const userId = req.userId;

        /** si pas de id */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** récupération des données */
        const userData = await User.findOne({
            where: {
                id: userId 
            },
            include:['links']
        });

        /** pas d'utilisateur */
        if(!userData){
            throw ({message: 'aucun compte associé à cet identifiant', statusCode:'400'});
        }

        /** parametre de image du profil */
        let avatarKey = req.AWSUploadKey ? req.AWSUploadKey : userData.avatar_key;

        /** nouvelles données utilisateur */
        const newUserData = { ...userData, ...{ avatar_key: avatarKey }};
       
        /** mise a jour de l'utilisateur */
        const updateUser = await userData.update({
            ...newUserData            
        });       

        return res.status(200).json({
            id: updateUser.id,
            login: updateUser.login,
            email: updateUser.email,
            avatarKey: updateUser.avatar_key,
            sex: updateUser.sex,
            usersLinks: updateUser.usersLinks,
            token: req.body.formToken
        });
    },
    /**
     * Suppresion de un utilisateur
     */
    deleteUserById: async(req ,res, next)=>{
        //récupération de l'utilisateur
        const userId = req.userId;

        /** si pas de id */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
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
        const userId = req.userId;

        /** si pas de id */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }
        
        /** */
        const { password, newPassword, confirmNewPassword }= req.body;

        if(!password || !newPassword || !confirmNewPassword){
            throw ({message: 'données manquantes pour la modification du mot de passe', statusCode:'400'});
        }

        const user = await User.findOne({
            where: {
                id: userId
            },
            include:['links']
        });       
        
        /** pas d'utilisateur de trouvé */
        if(!user){
            throw ({message: 'utilisateur absent de la base de données', statusCode:'400'});
        }

        const comparePassword = await bcrypt.compare(password , user.password);

        /** echec comparaiosn mot de passe */
        if(!comparePassword){
            throw ({message: 'echec de la mise à jour de votre mot de passe', statusCode:'403'}); 
        }

        /** erreur de confirmation de mot de passe */
        if(newPassword !== confirmNewPassword){
            throw ({message: 'erreur de confirmation du nouveau mot de passe', statusCode:'400'});
        }

        /** hash du nouveau mot de passe */
        const passwordHash =await bcrypt.hash(sanitizer.escape(newPassword),10);       
       

        /** mise a jour du mot de passe */
        const updateUser = await user.update({
            password: passwordHash        
        });
       
        return res.status(200).json({
            id: updateUser.id,
            login: updateUser.login,
            email: updateUser.email,
            avatarKey: updateUser.avatar_key,
            sex: updateUser.sex,
            usersLinks: updateUser.usersLinks,
            token: req.body.formToken
        });
    },

    /**
     * récupration de tous les utilisateurs
     */
    getAllUser: async(req ,res, next)=>{        
        /** Seule un admin ou l'utilisateur peut effectuer cette action */
        if( req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé à exécuter cette action', statusCode:'403'});
        }

        const resultUsers = await User.findAll({
            include:['role']
        });
        
        /**
         * Filtrage des informations 
         */
        const users = resultUsers.map(element => {
            const mapUsers = {};
            mapUsers.id = element.id;                        
            mapUsers.login = element.login;
            mapUsers.email = element.email;
            mapUsers.role_id = element.role_id;
            mapUsers.roleName = element.role.name;
            return mapUsers;
        });
        return res.json(users);  
    }

};

module.exports = userController;