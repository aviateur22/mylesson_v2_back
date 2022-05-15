const {User, Lesson, Notification } = require('../models');

/**role utilisateur */
const userRole = require('../helpers/userRole');
const notificationController = require('./notificationController');

const adminController={

    /**
     * Donne à un utilisateur des priviléges d'éditeur de contenu"
     */
    upgradeUserPriviligeByUserId: async(req, res, next)=> {
        const userId = parseInt(req.params.userId, 10);

        /** id utilisateur absent */
        if(!userId){
            throw ({message: 'Identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** id utilisateur pas au format numérique */
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrecte', statusCode:'400'});
        }

        /** Seule un admin peut executer cette action */
        if(req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /** recherche de l'utilisateur a upgradé*/
        const user = await User.findByPk(userId);

        if(!user){
            throw ({message: 'utilisateur absent de la base de données', statusCode:'404'});
        }

        /** nouvelles données utilisateurs */
        const newData = { ...user, ...{role_id: userRole.writer, request_upgrade_role: false}};            

        const updateUserRole = await user.update({
            ...newData
        });
        

        const message = 'droit d\'édition accordé';

        /** donnée admin */
        const adminData = {
            id: req.payload.userId,
            roleId: req.payload.role
        };

        /** génération d'un notification pour l'utilisateur */
        return notificationController.createNotification(adminData, user)(req, res, message);
    },

    /**
     * supprerssion des priviléges par userId
     */
    removeUserPrivilegeByUserId: async(req, res, next)=>{
        const userId = req.params.userId;

        /** id utilisateur absent */
        if(!userId){
            throw ({message: 'Identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** id utilisateur pas au format numérique */
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrecte', statusCode:'400'});
        }

        /** Seule un admin peut executer cette action */
        if(req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /** recherche de l'utilisateur a upgradé*/
        const user = await User.findByPk(userId);

        if(!user){
            throw ({message: 'utilisateur absent de la base de données', statusCode:'404'});
        }

        /** nouvelles données utilisateurs */
        const newData = { ...user, ...{role_id: userRole.user, request_upgrade_role: false}};

        const updateUserRole = await user.update({
            ...newData
        });        
        
        const message = 'droit d\'édition refusé';

        /** donnée admin */
        const adminData = {
            id: req.payload.userId,
            roleId: req.payload.role
        };

        /** génération d'un notification pour l'utilisateur */
        return notificationController.createNotification(adminData, user)(req, res, message);
    },

    /**
     * supprerssion des priviléges par login utilisateur
     */
    removeUserPrivilegeByUserLogin: async(req, res, next)=>{
        const userLogin = req.params.userLogin;

        /** id utilisateur absent */
        if(!userLogin){
            throw ({message: 'Identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** id utilisateur pas au format numérique */
        if(!isNaN(userLogin)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrecte', statusCode:'400'});
        }

        /** Seule un admin peut executer cette action */
        if(req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /** recherche de l'utilisateur a upgradé*/
        const user = await User.findOne({
            where:{
                login: userLogin
            }
        });

        if(!user){
            throw ({message: 'utilisateur absent de la base de données', statusCode:'404'});
        }

        /**vérifie que l'utilisateur n'est pas déja perdu ses droit d'édition */        
        if(parseInt(user.role_id, 10) === parseInt(userRole.user, 10)){
            throw ({message: `l'utilisateur ${user.login} à déja perdu ses droits d'édition`, statusCode:'400'});
        }

        /** nouvelles données utilisateurs */
        const newData = { ...user, ...{role_id: userRole.user, request_upgrade_role: false}};

        const updateUserRole = await user.update({
            ...newData
        });
        
        const message = 'droit d\'édition supprimé';

        /** donnée admin */
        const adminData = {
            id: req.payload.userId,
            roleId: req.payload.role
        };

        /** génération d'un notification pour l'utilisateur */
        return notificationController.createNotification(adminData, user)(req, res, message);
    },    

    /**Recupératon de tou les user voulant editer des lecons */
    getUserUpgradeRequest: async(req, res, next)=>{
        const users = await User.findAll({
            where: {
                request_upgrade_role: true
            }
        });

        /**nettoyage des données */
        const usersData = users.map(user=>{
            /**objet pour contenir les sonnées à renvoyer */
            const userData = {};
            userData.id = user.id;
            userData.login = user.login;
            userData.avatar = user.avatar_key;
            return userData;
        });

        return res.status(200).json({
            users: usersData
        });
    },

    /** Renvoie le nombre de utilisateur */
    countUpgradeRequest: async(req, res, next)=>{
        const users = await User.count({
            where: {
                request_upgrade_role: true
            }
        });

        return res.status(200).json(users);
    },

    /** récupération des lecon a caractere abusif */
    getAllAbusiveContent: async(req, res, next)=>{
        const lessons = await Lesson.findAll({
            where:{
                admin_request: true
            },
            include:['user']
        });

        const lessonMap = lessons.map(lesson=>{
            const data = {};
            data.lesson_title= lesson.title;
            data.lesson_slug= lesson.slug;
            data.user_image = lesson.user.avatar_key;
            data.user_login = lesson.user.login;
            return data;
        });
        return res.json(lessonMap);
    },

    /** Renvoie le nombre de contenu abusif */
    countAbusiveContent: async(req, res, next)=>{
        const lessons = await Lesson.count({
            where:{
                admin_request: true
            }
        });

        return res.status(200).json(lessons);
    },

    /**
     * Suppresion de un utilisateur
     */
    deleteUserByLogin: async(req ,res, next)=>{
        //récupération de l'utilisateur
        const userLogin = req.params.userLogin;

        /** si pas de id */
        if(!userLogin){
            throw ({message: 'identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** si pas de id */
        if(!isNaN(userLogin)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrecte', statusCode:'400'});
        }

        /** Seule un admin peut executer cette action */
        if(req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /** utilisateur a supprimer */
        const deleteUser = await User.findOne({
            where: {
                login: userLogin
            }
        });

        /** utilisateur absent de la base de données */
        if(!deleteUser){
            throw ({message: 'l\'utilisateur à supprimer n\'est pas en base de données', statusCode:'404'});
        }

        /** suppression utilisatzur */
        await deleteUser.destroy();       

        return res.status(204).json({
            message: 'utilisateur supprimé'
        });
    },

    deleteContent: (req, res, next)=>{

    }

};

module.exports = adminController;