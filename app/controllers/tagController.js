const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sanitizer = require('sanitizer');
const {Tag} = require('../models/index');

const tagController = {

    /**
     * Recherche des tags
     * @param {Object} req
     * @param {Object} res 
     * @param {Object} next 
     */
    findTagByName:async(req, res, next) => {
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
    }
};
module.exports = tagController;