const bcrypt = require('bcrypt');
const { User } = require('../models/index');
const sanitizer = require('sanitizer');
const xss = require('xss');

/**role utilisateur */
const userRole = require('../helpers/userRole');

/**token JWT */
const JWT = require('../helpers/security/jwt');
const jwtExpire = require('../helpers/jwtExpire');


/** aws pour le download */
const awsManager = require('../helpers/aws');

/**nodemailer */
const nodeMailer = require('../helpers/mailer/nodeMailer');

/** comparaions de token */
const tokenCompare = require('../helpers/security/tokenCompare');


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
                email:sanitizer.escape(req.body.email) 
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

        /**suppression du JWT de réinitialisation de mot de passe */
        if(user.reset_email_token){
            /**nouvelles données */
            const newData = {...user,...{reset_email_token: null}};

            /**mise a jour de la base de données */
            await user.update(newData);
        }
       
        /** génération token */
        const jwt = new JWT(jwtExpire.login.expiresIn);

        const jwtGen = await jwt.generateJwt({user: user.id, role: user.role_id});

        
        /** Renvoie d'un JWT pour gestion des authorization */
        res.cookie('authorization', jwtGen, { secure: true, sameSite:'none', httpOnly: true });   

        /**suppression du cookie visteur */
        res.clearCookie('visitor_auth');    

        return res.status(200).json({
            'message':`Bienvenu sur votre compte ${user.login}`,            
            'user' : user.login,
            'role' : user.role_id,
            'id' : user.id,
        });        
    },
    
    /**
     * Inscription
     */
    register: async(req, res ,_)=> {       
        const {login, email, password, confirmPassword, checkboxCgu} = req.body;        

        if(!login || !email || !password || !confirmPassword) {    
            throw ({message: 'email, mot de passe et confirmation du mot de passe obligatoire', statusCode:'400'});
        }        
        
        if(checkboxCgu !== 'true'){
            throw ({message: 'Les CGU doivent être accéptés', statusCode:'400'});
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

        /** login utilisé */
        if(user) {      
            throw ({message: 'ce login est déjà existant', statusCode:'409'});
        }

        const passwordHash =await bcrypt.hash(password,10);

        await User.create({
            login: sanitizer.escape(xss(login)),
            email: sanitizer.escape(xss(email)),
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
        /** suppression des cookie */
        res.clearCookie('auth_token');
        res.clearCookie('visitor_auth');
        res.clearCookie('authorization');

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
            throw ({message: 'utilisateur absent de la base de données', statusCode:'404'});
        }
       
        return res.status(200).json({
            id: user.id,
            login: user.login,
            email: user.email,
            sex: user.sex,
            avatarKey: user.avatar_key,
            links: user.links,
            requestRoleUpgrade: user.request_upgrade_role
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
            const findEmail = await User.findOne({
                where: {
                    email: email 
                }
            });
            

            /** email déja utilisé si id utilisateur different */
            if(findEmail && Number(findEmail.id) !== Number(userId)) {      
                throw ({message: 'cet email est déjà existant', statusCode:'409'});
            }
        }

        /** modification du login */
        if(login){
            const findLogin = await User.findOne({
                where: {
                    login: login 
                }
            });
            

            /** login déja utilisé si id utilisateur different */
            if(findLogin && Number(findLogin.id) !== Number(userId)) {      
                throw ({message: 'ce login est déjà existant', statusCode:'409'});
            }
        }

        /** nouvelles données utilisateur */
        const newUserData = { ...userData, ...{ email: sanitizer.escape(xss(email)), login: sanitizer.escape(xss(login)), sex: sex ? sanitizer.escape(sex): null }};
       
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
            requestRoleUpgrade: userData.request_upgrade_role
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
            requestRoleUpgrade: updateUser.request_upgrade_role
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
            return res.status(404).json({});
        }

        /** suppression utilisatzur */
        await deleteUser.destroy();       

        return res.status(204).json();
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
            throw ({message: 'echec de la mise à jour de votre mot de passe', statusCode:'400'}); 
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
            requestRoleUpgrade: updateUser.request_upgrade_role
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
    },

    /**
     * demande pour devenir éditeur
     */
    userUpgradeRoleRequest: async(req, res, next)=>{
        //récupération de l'utilisateur
        const userId = req.userId;

        /** si pas de id */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});            
        }

        /** recherche utilisateur */
        const user = await User.findByPk(userId);

        if(!user){
            throw ({message: 'utilisateur abasent de la base de données', statusCode:'404'});
        }

        if(user.request_upgrade_role===true){
            return res.status(200).json({      
                id: user.id,
                message: 'demande en cours de traitement'         
            });
        }


        /** nouvelles données utilisateurs */
        const newData = { ...user, ...{request_upgrade_role: true}};

        /**demande de devenir éditeur */
        const upgradeUserRole = await user.update(newData);      

        return res.status(200).json({            
            id: upgradeUserRole.id,
            login: upgradeUserRole.login,
            email: upgradeUserRole.email,
            avatarKey: upgradeUserRole.avatar_key,
            sex: upgradeUserRole.sex,
            usersLinks: upgradeUserRole.usersLinks,
            requestRoleUpgrade: upgradeUserRole.request_upgrade_role
        });
    },

    /**envoie reset mot de passe */    
    sendEmailPasswordLost: async(req, res, next)=>{
        /**email */
        const email = sanitizer.escape(req.params.email);
        
        if(!email || !isNaN(email)){
            throw ({message: 'vérifier votre email', statusCode:'400'});
        }

        /** recherche utilisateur */
        const findUser = await User.findOne({
            where: {
                email: email
            }
        });

        if(!findUser){
            throw ({message: 'aucune personne ne correspond à votre adresse email', statusCode:'400'});
        }

        /** création dun token et jwt */
        const jwt = new JWT(jwtExpire.reinitializePassword.expiresIn);

        const data = await jwt.generateToken();        

        /** récupération JWT valide 48h avec le token chiffré pour la database */
        const jwtDatabase = data.jwt;

        /** récupération Token chiffré pour l'envoie email il sera contenu dans le link */
        const tokenMail = data.token;

        /**mise a jour du jwt dans la database */
        const newData = { ...findUser, ...{reset_email_token: jwtDatabase }};

        /**mise a jour données utilisateur avec le jwt */
        const updateUser = await findUser.update(newData);

        if(!updateUser){
            throw ({message: 'echec initialisation reset du mot de passe', statusCode:'400'});
        }
       
        /** instanciation nodemailer */
        const mailer = new nodeMailer('resetPassword', findUser.email, findUser.id, tokenMail);

        /**envoie de l'email */
        await mailer.sendEmail();

        res.status(200).json({
            userId: findUser.id
        });
    },

    /** 
     * réinitialisation mote de passe
     */
    resetPasswordByUserId: async(req, res, next)=>{
        const param = req.body.param;
        const password = req.body.password;
        const cfmPassword = req.body.confirmPassword;

        if(password !== cfmPassword){
            throw ({message: 'les mots de passe ne sont pas identique', statusCode:'400'});
        }

        if(!param ){
            throw ({message: 'données manquantes pour valider l\'action', statusCode:'400'});
        }

        /**user id */
        const userId = req.userId;

        if(!userId || isNaN(parseInt(userId, 10))){
            throw ({message: 'erreur dans le format de l\'identifiant utilisateur', statusCode:'400'});
        }

        /** recherche utilisateur */
        const user = await User.findByPk(userId);
       
        if(!user){
            throw ({message: 'utilisateur absent de la base de données', statusCode:'400'});
        }

        /**JWT présent en base de données */
        const userJWT =  user.reset_email_token;

        /**pas de jwt */
        if(!userJWT){
            throw ({message: 'données manquantes pour valider l\'action', statusCode:'400'});
        }
        
        const checkToken = await tokenCompare.compareTokenWithoutSecret(userJWT, param);

        if(!checkToken){
            throw ({message:'oupsss token invalid', statusCode:'403'});
        }  
        
        const passwordHash =await bcrypt.hash(password,10);
        
        /** mise a jour des mots de passe */
        const newData = { ...user, ...{password: passwordHash, reset_email_token: null}};

        const updateUser = await user.update(newData);

        if(!updateUser){
            throw ({message:'echec mise à jour du mot de passe', statusCode:'403'});
        }

        res.status(200).json({
            user: updateUser.id
        });     
    }
};

module.exports = userController;