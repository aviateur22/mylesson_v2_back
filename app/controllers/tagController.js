const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sanitizer = require('sanitizer');
const {Tag} = require('../models/index');
const userRole = require('../helpers/userRole');

const tagController = {

    /**
     * Recherche des tags
     * @param {Object} req
     * @param {Object} res 
     * @param {Object} next 
     */
    findTagByName: async(req, res, next) => {
        const tag =sanitizer.escape(req.params.name);

        if(!tag){
            throw ({ message: 'le nom du tag ne peut pas être vide', statusCode:'422' });
        }
        
        //recherche limité a 10 caractères
        if(tag.length < 10){
            const findTag =await Tag.findAll({
                where:{
                    name:{
                        [Op.like]:'%'+tag.toLowerCase()+'%'
                    }
                }
            });
            if(findTag){
                res.status(200).json(findTag); 
            }
        }
    },

    /**ajout d'un nouveau tag */
    addTag: async(req, res, next)=>{
        /** seul un admin peut executer cette action */
        if(req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        const { name } =req.body;

        if(!name){
            throw ({message: 'le nom du tag est obligatoire', statusCode:'400'});
        }

        /**vérification tag pas existant */
        const findTag = await Tag.findOne({
            where: {
                name
            }
        });

        /**tag déja présent */
        if(findTag){
            throw ({message: 'ce nom de tag est déja existant', statusCode:'409'});
        }

        /**ajout du tag en base de données */
        const tag = await Tag.create(
            {
                name
            },{
                returning: true
            }
        );

        return res.status(201).json(tag);
    },

    /** récupération d'un tag par id */
    getTagById: async(req, res, next)=>{

    },

    /** modification d'un tag */
    updateTagById: async(req, res, next)=>{

    },

    /** suppression d'un tag */
    deleteTagById: async(req, res, next)=>{
        /** seul un admin peut executer cette action */
        if(req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }
      
        const tagId = parseInt(req.params.id, 10);
        
        if(!tagId){
            throw ({message: 'l\'identifiant du tag est manquant', statusCode:'400'});
        }
        
        if(isNaN(tagId)){
            throw ({message: 'le format de l\'identifiant du tag est incorrect', statusCode:'400'});
        }

        /**vérification tag pas existant */
        const findTag = await Tag.findByPk(tagId);

        /**tag déja présent */
        if(!findTag){
            throw ({message: 'aucun tag associé associé à cet identifiant', statusCode:'400'});
        }

        /**suppréssion du tag */
        await findTag.destroy();
        return res.status(200).json(findTag);
    },

    /** suppression d'un tag */
    getAllTag: async(req, res, next)=>{
    }
};
module.exports = tagController;