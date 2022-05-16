const bcrypt = require('bcrypt');
const { User, Link, UserLink } = require('../models/index');
const sanitizer = require('sanitizer');
const fileReader = require('../helpers/fileReader');

const AES = require('../helpers/security/aes');
const jsonwebtoken = require('jsonwebtoken');

/**role utilisateur */
const userRole = require('../helpers/userRole');

/**token JWT */
const jwtToken = require('../helpers/security/jwt');

/** aws pour le download */
const awsManager = require('../helpers/aws');

const nodeMailer = require('../helpers/mailer/nodeMailer');

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
            throw ({message: 'utilisateur absent de la base de données', statusCode:'404'});
        }

        const token = res.formToken;
       
        return res.status(200).json({
            id: user.id,
            login: user.login,
            email: user.email,
            sex: user.sex,
            avatarKey: user.avatar_key,
            links: user.links,
            token: token,
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
            requestRoleUpgrade: userData.request_upgrade_role,
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
            requestRoleUpgrade: updateUser.request_upgrade_role,
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
            requestRoleUpgrade: updateUser.request_upgrade_role,
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
            requestRoleUpgrade: upgradeUserRole.request_upgrade_role,
            token: req.body.formToken
        });
    },

    /**envoie reset mot de passe */    
    sendEmailPasswordLost: async(req, res, next)=>{
        /**email */
        const email = req.params.email;
        
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

        /**génération token  */       
        const resultToken = await jwtToken({mail: true});

        /** récupération JWT valide 48h avec le token chiffré pour la database */
        const jwt = resultToken.token;

        /** récupération Token chiffré pour l'envoie email il sera contenu dans le link */
        const tokenMail = resultToken.formToken;        

        /**mise a jour du jwt dans la database */
        const newData = { ...findUser, ...{reset_email_token: jwt }};

        /**mise a jour du jwt */
        const updateUser = await findUser.update(newData);

        if(!updateUser){
            throw ({message: 'echec initialisation', statusCode:'400'});
        }

        /** uri de la requete */
        let baseUri;

        /**link a envoyer par email */
        if(process.env.NODE_ENV ==='DEV'){
            baseUri = 'http://localhost:8080';
        } else {
            baseUri = 'https://www.mydevlesson.com';
        }

        const link = baseUri +'/users/' + findUser.id + '/lost-password/token/'+ tokenMail;

        /** transporter pour l'email*/
        const transporter = nodeMailer.transporterConfig();

        /** ficheir template html */
        const templateHtml = await fileReader('app/static/template/email.html');

        /** template mise a jour avec le link  */
        const templateHtmlLink = templateHtml.replace(':xxxx', link);

        /** envoie de l'email */
        await nodeMailer.passwordLostMail(transporter, findUser.email, templateHtmlLink);

        res.status(200).json({
            link: link
        });
    },

    resetPasswordByUserId: async(req, res, next)=>{
        const token = req.body.token;
        const userId = req.params.userId;
        const password = req.body.password;
        const cfmPassword = req.body.cfmPassword;        

        const user = await User.findByPk(userId);
       
        if(!user){
            throw ({message: 'utilisateur absent de la base de données', statusCode:'400'});
        }

        const userJWT =  user.reset_email_token;


        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        await jsonwebtoken.verify(userJWT, KEY, async function(err, payload) {
            if(err){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }     
            
            /** token formulaire du JWT */
            const tokenDatabase = payload.formToken;  

            /** token absent */
            if(!tokenDatabase){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }           
            
            /** decryptage des token */
            const aes = new AES();

            /** décodage base64 -> UTF-8 puis décryptage du token req.body */
            const tokenDatabaseDecrypt =  await aes.decrypt(tokenDatabase);

            /** décodage base64 -> UTF-8 puis décryptage du token cookie  */
            const tokenDecrypt =  await aes.decrypt(token);
            console.log(tokenDecrypt, tokenDatabaseDecrypt)
            /**verification cohérence token non décrypté */            
            if(tokenDatabaseDecrypt != tokenDecrypt){
                throw ({message: 'oupsss token invalid', statusCode:'403'});
            }

            res.status(200).json({
                message: 'ok'
            })
        });
    }



};

module.exports = userController;