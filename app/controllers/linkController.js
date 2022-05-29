const { Link, UserLink, User } = require('../models/index');
const sanitize = require('sanitizer');
const userRole = require('../helpers/userRole');


const linkController = {
    /**
     * Ajout d'un nouveau link utilisateur 
     */
    saveLinkByUserId: async(req, res, next)=>{
        const userId = req.userId;
      
        /** si pas de userId */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** récuperation des liens urls  */
        const  mediaId = parseInt(req.body.mediaId, 10);

        /** si compagnyId de manquant */
        if(!mediaId){
            throw ({message: 'l\'identifiant du le média est absent', statusCode:'400'});            
        }

        /** si format compagnyId erronné */
        if(isNaN(mediaId)){
            throw ({message: 'l\'identifiant du média n\'est pas correct', statusCode:'400'});            
        }

        const linkUrl = req.body.linkUrl;

        if(!linkUrl){
            throw ({message: 'le lien http est obligatoire pour l\'ajout du link', statusCode:'400'}); 
        }      

        const user = await User.findByPk(userId, {
            include: ['links']
        });
      
        /** l'utilisateur n'existe pas */
        if(!user){
            return null;
        }
        
        /** vérification existence du média */
        const findMedia = await Link.findByPk(mediaId);

        /** le média n'est pas repertirioé */
        if(!findMedia){
            throw ({message: 'ce média n\'est pas référencé', statusCode:'400'}); 
        }       

        /** recherche du link media */
        const userLinkMedia = await UserLink.findOne({
            where:{
                user_id: userId,
                link_id: mediaId
            }
        });

        /** reponse code
         * create 201
         * update 200
         */
        let statusCode;
        /**nettoyage de l'entrée utilisateur */
        const sanitizeUrlLink = sanitize.escape(linkUrl);
        
        if(userLinkMedia){
            /** mise a jour des données links utilisateur */
            const updateLink = await userLinkMedia.update({
                user_id: userId,
                link_id: mediaId,
                link_url: sanitizeUrlLink,
            });  

            /** echec update */
            if(!updateLink){
                throw ({message: 'la mise à jour de votre lien à échoué', statusCode:'400'});
            }

            /** defini le code a renvoyer */
            statusCode = 200;
        } else {
            /** création d'un nouveau lien media */
            const addLink = await user.addLinks(mediaId, {
                through: {
                    link_url: sanitizeUrlLink
                }
            }); 
            
            /**echec de creation */
            if(!addLink){
                throw ({message: 'l\'ajout de votre lien à échoué', statusCode:'400'});
            }

            /** defini le code a renvoyer */
            statusCode = 201;
        }
        
        /** récupération des informations à jour */
        const updateUser = await User.findByPk(userId, {
            include: ['links']
        });

        return res.status(statusCode).json({
            id: updateUser.id,
            login: updateUser.login,
            email: updateUser.email,
            sex: updateUser.sex,
            avatarKey: updateUser.avatar_key,
            links: updateUser.links,
            token: {
                token: req.body.token,
                secret: req.body.secret
            }
        });  
    },

    /**
     * recuperation d'un link utilisateur par son id
     */
    getLinkById: (req, res, next)=>{

    },

    /**
     * Suppression d'un link utilisateur par son id
     */
    deleteLinkByUserId: async(req, res, next)=>{
        /** userId */
        const userId = req.userId;

        /** si pas de userId */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }

        /** link id */
        const mediaLinkId = parseInt(req.body.mediaLinkId, 10);

        if(!mediaLinkId){
            throw ({message: 'l\'identifiant du média à supprimer est manquant', statusCode:'400'});
        }

        if(isNaN(mediaLinkId)){
            throw ({message: 'le format de l\'identifiant du média à supprimer est érroné', statusCode:'400'});
        }

        /** vériication existence du link */
        const link = await UserLink.findOne({
            where:{
                link_id: mediaLinkId,
                user_id: userId
            }
        });

        if(!link){
            throw ({ message: 'le lien n\'est pas trouvé en base de données', statusCode: 404});
        }

        /** Seule un admin ou le propriétaire de la lecon peut executer cette action */
        if(userId !== parseInt(link.user_id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /** suppression du link */
        const linkDelete = await UserLink.destroy({
            where:{
                user_id: userId,
                link_id: mediaLinkId
            }         
        });

        /** lecon pas trouvée */
        if(!linkDelete){
            throw ({ message: 'le lien n\'est pas trouvé en base de données', statusCode: 404});
        }

        /** récupération des informations à jour */
        const updateUser = await User.findByPk(userId, {
            include: ['links']
        });

        return res.status(200).json({
            id: updateUser.id,
            login: updateUser.login,
            email: updateUser.email,
            sex: updateUser.sex,
            avatarKey: updateUser.avatar_key,
            links: updateUser.links,
            token: {
                token: req.body.token,
                secret: req.body.secret
            }
        });  
    },

    /**
     * récuperation de tous les link d'un utilisateur
     */
    getLinkByUserId: async(req, res, next)=>{
        const userId = req.userId;
        
        /** si pas de userId */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }
       
        const userLink = await UserLink.findAll({
            where:{
                user_id: userId
            }
        });

        if(userLink.length === 0){
            return res.status(204).json();
        }

        return res.status(200).json(userLink);
    },

    /**
     * récuperation des images des differents media par name
     */
    getLinkByName: async(req, res, next)=>{
        //récupération de l'utilisateur
        const mediaName = req.params.media; 
        
        /** données utilisateur absent */
        if(!mediaName){
            throw ({message: 'l\'identififiant du media est manquant', statusCode:'400'});
        }

        /** image reseau sociaux */
        const mediaImage = await Link.findAll();        
        

        const mediaRequest = mediaImage.find(image => image.compagny_name === mediaName);

        /** si le media n'est pas repertirioé */
        if(!mediaRequest){
            throw ({message: 'l\'identififiant du media est inconnu', statusCode:'400'});
        }

        /** si le media n'est pas repertirioé */
        if(!mediaRequest.image_name){
            throw ({message: 'l\'identififiant du media est inconnu', statusCode:'400'});
        }

        /** mise en forme de l'url */
        const url = process.env.FOLDER_MEDIA + mediaRequest.image_name;

        return res.status(200).json({
            pathUrl: url
        });
    },

    /**
     * récuperation de tous les links disponible
     */
    getAllLinks: async(req, res, next)=>{
        const links = await Link.findAll();
        res.status(200).json(links);
    }
 
};
module.exports = linkController;