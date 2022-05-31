const {Notification, User } = require('../models');

/**role utilisateur */
const userRole = require('../helpers/userRole');

const notificationController = {
    /**
     * Ajout d'une notification 
     * @param {Object} userSource - personne ayant activée la notification
     * @property {Number} userSource.id - 
     * @property {Number} userSource.roleId - 
     * @param {Object} user - Instance Sequelize - utilisateur recevant la notification
     * @returns 
     */
    createNotification:(userSource, user, message) => async(req, res, callback) => {         
        /**vérification des données */
        if(!userSource.id){
            throw ({message: 'données manquantes pour générer la notification', statusCode:'400'});             
        }

        if(!userSource.roleId){
            throw ({message: 'données manquantes pour générer la notification', statusCode:'400'});             
        }

        if(!message){
            throw ({message: 'données manquantes pour générer la notification', statusCode:'400'});             
        }

        if(!user){
            throw ({message: 'données manquante pour générer la notification', statusCode:'400'});             
        }

        /** Seule un admin peut executer cette action */
        if(userSource.roleId < userRole.user){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /** enregistrement notification */
        const notification = await Notification.create({
            text: message            
        });
        
        /** enregistrement table de liaison */
        const userNotification = await user.addNotifications(notification, {
            through: {
                user_source_id: userSource.id
            }
        });

        if(!userNotification){
            throw ({message: 'erreur remplissage table de liaison user-notification', statusCode:'500'});
        }       
    
        callback();
    },

    /**
     * suppression d'une notification
     */
    deleteNotification: async(req, res, next) =>{
        /**notifiaction id */
        const notificationId = req.params.notificationId;

        if(!notificationId){
            throw ({message: 'le format de l\'identifiant de la notification est incorrect', statusCode:'400'});  
        }

        if(isNaN(notificationId)){
            throw ({message: 'le format de l\'identifiant de la notification est incorrect', statusCode:'400'});
        }

        /**recherche de la notifiaction */
        const notification = await Notification.findByPk(notificationId,{
            include: ['users']
        });

        if(!notification){
            throw ({message: 'aucune notification ne correspond à cet identifiant', statusCode:'400'});  
        }

        //pas d'utilisateur associé
        if(!notification.users || notification.users.length <= 0){
            throw ({message: 'aucun utilisateur n\'est associé a cette notification', statusCode:'400'});
        }

        //récupération userId a partir de la notification
        const userId = notification.users[0].UserNotification?.user_id;
               
        //seul le proprietaire de la notification ou un admin peut lire une notification
        if(parseInt(userId, 10) !== parseInt(req.payload.userId, 10) && parseInt(req.payload.role, 10) < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé à faire cette action', statusCode:'400'});
        }

        /**suppression notif */
        await notification.destroy();

        res.status(204).json({});
    },

    /**
     * recherche de toutes les notifications pour un utilisataur
     */
    findNotificationByUserId: async(req, res, next)=>{
        /** utilisateur id */
        const userId = req.params.userId;

        if(!userId){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'400'});  
        }

        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'400'});
        }

        /** recherche des notifications associés */
        const findNotification = await User.findByPk(userId,  {
            
            include: ['notifications'],
            order: [['notifications', 'updated_at','desc']]
        });    
        
        /**aucun utilisateur */
        if(!findNotification){
            return res.status(404).json({ 
                message: 'aucun utilisateur utilisateur',                
            });
        }
        
        /** tableau de notifications */
        const notifications = findNotification.notifications;
       
        return res.status(200).json({ 
            notifications
        });
    },
    
    /**
     * Nombre de notifications non lus
     */
    countUnreadNotificationByUserId: async(req, res, next)=>{
        /** utilisateur id */
        const userId = req.params.userId;

        if(!userId){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'400'});  
        }

        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'400'});
        }

        /** recherche des notifications associés */
        const findNotification = await User.findByPk(userId,  {
            include: [{
                model:  Notification,
                as: 'notifications',
                required: false,
                where: {
                    new: 'true'
                }
            }]
        });              
        
        /**aucun utilisateur */
        if(!findNotification){
            return res.status(404).json({ 
                message: 'aucun utilisateur utilisateur',
                notificationCount: 0
            });
        }

        /** tableau de notifications */
        const notifications = findNotification.notifications;

        return res.status(200).json({
            notificationCount: notifications.length });
    },


    readNotificationById: async(req, res, next) => {
        /** utilisateur id */
        const notificationId = parseInt(req.params.notificationId, 10);

        if(!notificationId || isNaN(notificationId)){
            throw ({message: 'le format de l\'identifiant de la notification est incorrect',
                statusCode:'400'});
        }

        /** recherche de la notification */
        const findNotification = await Notification.findByPk(notificationId, {
            include: ['users']
        });                      
        
        if(!findNotification){
            throw ({message: 'la notification n\'est pas trouvée en base de données', statusCode:'400'});
        }
        
        //pas d'utilisateur associé
        if(!findNotification.users  || findNotification.users.length <= 0){
            throw ({message: 'aucun utilisateur n\'est associé a cette notification', statusCode:'400'});
        }

        //récupération userId a partir de la notification
        const userId = findNotification.users[0].UserNotification?.user_id;
        
        /** on ne change pas si new a false */
        if(findNotification.new === false){
            return res.status(200).json({
                notification_status: findNotification.new
            });
        }

        //seul le proprietaire de la notification ou un admin peut éxecuter l'action
        if(parseInt(userId, 10) !== parseInt(req.payload.userId, 10) 
        && parseInt(req.payload.role, 10) < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé à faire cette action', statusCode:'400'});
        }
    
        /**update notification */
        const newData = {...findNotification, ...{new: false}};

        const updateNotification = await findNotification.update(newData);

        return res.status(200).json({
            notification_status: updateNotification.new
        });
    }
};

module.exports = notificationController;