const { Link, UserLink, User } = require('../models/index');
const { findOne } = require('../models/user');

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
        const {linkUrl, mediaId} = req.body;

        /** si compagnyId de manquant */
        if(!mediaId){
            throw ({message: 'l\'identifiant du le média est absent', statusCode:'400'});            
        }

        /** si format compagnyId erronné */
        if(isNaN(mediaId)){
            throw ({message: 'l\'identifiant du média n\'est pas correct', statusCode:'400'});            
        }

        /** vérification si le média es réferencé */
        const findMedia = await Link.findByPk(mediaId);

        if(!findMedia){
            throw ({message: 'ce média n\'est pas référencé', statusCode:'400'}); 
        }

        /** recherche du link media */
        const userLinkMedia =  await UserLink.findOne({
            where:{
                user_id: userId,
                link_id: mediaId
            }
        });

        /** si media trouvé */
        if(userLinkMedia){
            const userUpdate = await userLinkMedia.update({
                link_id: mediaId,
                user_id: userId,
                link_url: linkUrl
            });

            return res.status(201).json(userUpdate);
        } else {
            /** ajout dr'un nouveau compte */                  
            const userAddLink = await UserLink.create({
                link_id: mediaId,
                user_id: userId,
                link_url: linkUrl
            });
            return res.status(201).json(userAddLink);
        }
    },

    /**
     * recuperation d'un link utilisateur par son id
     */
    getLinkById: (req, res, next)=>{

    },

    /**
     * modification d'un link utilisateur par son id
     */
    updateLinkById: (req, res, next)=>{

    },


    /**
     * Suppression d'un link utilisateur par son id
     */
    deleteLinkById: (req, res, next)=>{

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

        /** mise en forme de l'url */
        const url = process.env.FOLDER_IMAGE + mediaRequest;

        return res.status(200).json({
            mediaRequest,
            pathUrl: process.env.FOLDER_IMAGE
        });
    }
};
module.exports = linkController;