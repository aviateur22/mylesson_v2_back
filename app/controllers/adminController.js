const bcrypt = require('bcrypt');

const {User} = require('../models');

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
            userData.email = user.login;
            return userData;
        });

        return res.status(200).json({
            users: usersData
        });
    },

    deleteContent: (req, res, next)=>{

    }

};

module.exports = adminController;