const bcrypt = require('bcrypt');

const {User, Lesson} = require('../models');

/**role utilisateur */
const userRole = require('../helpers/userRole');

const adminController={

    /**
     * Donne à un utilisateur des priviléges d'éditeur de contenu"
     */
    upgradeUserPrivilige: async(req, res, next)=> {
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

        return res.status(200).json({
            id: updateUserRole.id,
            login: updateUserRole.login,
            role: updateUserRole.role_id
        });
    },

    /**
     * supprerssion des priviléges
     */
    removeUserPrivilege: async(req, res, next)=>{
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

        /** nouvelles données utilisateurs */
        const newData = { ...user, ...{role_id: userRole.user, request_upgrade_role: false}};

        const updateUserRole = await user.update({
            ...newData
        });

        return res.status(200).json({
            id: updateUserRole.id,
        });
    },

    /**Recupératon de tou sles user voulant editer des lecons */
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

    /**
     * récupération des lecon a caractere abusif 
     */
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