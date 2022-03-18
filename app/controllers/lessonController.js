const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sanitizer = require('sanitizer');
const {Lesson, Tag, lessonTag} = require('../models/index');
const CRYPTO_AES = require('../helpers/security/aes');
const aes = new CRYPTO_AES();

const lessonController = {

    /**
     * upload file
     */
    upload:()=>{

    },

    /**
     * Création d'une nouvelle leçon
     */
    create:(createLessonSchemaError) => async(req, res, next) => {
        //recuperation tagId, title, content
        const {tagId, title, content} = req.body;

        /**titre et content manquant */
        if(!title, !content){
            throw ({message: 'titre et contenu ne peuvent pas être vide', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }

        /**id tag manquant */
        if(!tagId){
            throw ({message: 'tags id absent', statusCode:'500', resetAuth: false , redirect :'/', error: true});
        }

        /**Nettoyage des données utilisateur */
        const contentEscape = sanitizer.escape(content);
        const titleEscape = sanitizer.escape(title);

        //création d'un tableau tags id
        const tags = tagId.split('/').map(tag => parseInt(tag, 10));

        //vérification des ids de tag
        tags.forEach(tag => {
            if(isNaN(tag)){
                return;
            }            
        });

        /** slug de la leçon*/
        const slug = titleEscape.trim().replace(/\s/g,'-');

        /** Création de le leçon */
        let createLesson = await Lesson.create({
            title: titleEscape,
            content : contentEscape,
            user_id: req.session.user.id ,
            slug: slug    
        });

        const id = createLesson.id;
        
        /**Generation des tags */
        await (async()=>{
            const promises = [];
            tags.forEach((tag)=>{   
                const query =  lessonTag.create({                    
                    lesson_id: id,
                    tag_id: tag                    
                });         
                promises.push(query);
            });
            const outputs = await Promise.all(promises);
        })();

        /**Recuperation de la leçon */
        createLesson = await Lesson.findByPk(id,{
            include:{
                model: Tag, as: 'tags'
            }
        }); 

        res.status(201).json(createLesson);
    },

    /**
     * Recherche d'un tag 
     * @param {Object} req
     * @param {Object} res 
     * @param {Object} next 
     */
    findTag:async(req,res,next) => {
        const tag =sanitizer.escape(req.body.tag);
        //recherche limité a 10 caractères
        if(tag.length<10){
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

    /**
     * Récupération de toute les lessons
     */
    getAll: async(req, res, next)=>{
        const lessons = await Lesson.findAll({
            include:{
                model: Tag, as: 'tags'
            }
        });
        return res.json(lessons);
    },

    /**
     * update d'une leçon
     */
    update: () => async(req, res, next)=>{
        //recuperation id de la lesson
        const id = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(id)){
            throw ({message: 'format id leçon incorrect', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }

        //recuperation tagId
        const {tagId, title, content} = req.body;

        if(!tagId || !title || !content){
            throw ({message: 'le titre et contenu ne peuvent pas être vide', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }

        /**Nettoyage des données utilisateur */
        const contentEscape = sanitizer.escape(content);
        const titleEscape = sanitizer.escape(title);

        //création d'un tableau tags id
        const tags = tagId.split('/').map(tag => parseInt(tag, 10));

        //vérification des ids de tag
        tags.forEach(tag => {
            if(isNaN(tag)){
                throw ({message: 'erreur dans le format des tags id', statusCode:'422', resetAuth: false , redirect :'/', error: true});
            }            
        });

        const lesson = await Lesson.findByPk(id);

        /** aucun id correspondant  */
        if(!lesson){
            throw ({message: 'la leçon n\'est pas présente en base de données', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }

        /**Verification concordence des user_id */
        if(parseInt(req.session.user.id, 10) !== parseInt(lesson.user_id, 10)){
            throw ({message: 'cette leçon ne vous appartient pas', statusCode:'401', resetAuth: false , redirect :'/', error: true});
        }

        let updateLesson = await lesson.update({                
            title: titleEscape,
            content : contentEscape
        });

        /**
         * Gestion relation tag et lesson
         */
        //destruction des anciens tags
        await lessonTag.destroy({
            where:{                   
                lesson_id: id
            }                                   
        });

        await (async()=>{
            const promises = [];           
            tags.forEach((tag)=>{   
                const query =  lessonTag.create({                    
                    lesson_id: id,
                    tag_id: tag                    
                });         
                promises.push(query);
            });
            const outputs = await Promise.all(promises);
        })();

        /**Recuperation de la leçon */
        updateLesson = await Lesson.findByPk(id,{
            include:{
                model: Tag, as: 'tags'
            }
        });
        return res.json(updateLesson);
    },

   
    /**
     * Recuperation leçon par son id
     * @returns {Object} lesson 
     */
    getById: () => async(req, res, next)=>{
        /**Vérification id */
        const id =parseInt(req.params.id, 10);
        if(isNaN(id)){
            throw ({message: 'erreur dans le format de l\'id', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }            
        const lesson =await Lesson.findByPk(id, {
            include:['tags','user']
        });           

        console.log(lesson);

       
        /**Renvoide la leçon */
        res.json({
            title: lesson.title,
            content: lesson.content,
            tags: lesson.tags,
            autor: lesson.user.login,
            created: lesson.formatedCreationDate,
            updated: lesson.formatedUpdateDate            
        });
    },

    /**
     * Suppression de une leçon
     */
    delete: (req, res, next)=>{

    },
   
    /**
     * Récuperation de toutes les lecons d'un user
     * @returns {object} lessons - Leçons créées par l'utilisateur
     */
    getByUserId:() => async(req, res, next)=>{       
        const userId = req.headers['user-ident'];

        if(!userId){
            throw ({message: 'id utilisateur absent', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }
        /**recuperation id utilisateur */
        const decryptUserId = aes.decrypt(userId);
        /**Verification longueur tableau */
        if(decryptUserId?.split(':').length !== 2){
            throw ({message: 'erreur dechiffrement userId', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        }
        const id = decryptUserId.split(':')[1];

        /**verification de l'id et session.id */
        const sessionId = `userid:${req.session.user?.id}`;        
        const idCompare = decryptUserId === sessionId ? true : false;
        if(!idCompare){
            console.log('id pas identique');
            throw ({message: 'erreur dechiffrement userId', statusCode:'422', resetAuth: false , redirect :'/', error: true});
        } 

        /**requete sur les leçon utilisateurs */
        const resultsLessons = await Lesson.findAll({
            where:{
                user_id :id 
            },                
            include:{
                model: Tag, as: 'tags', attributes:['name']
            }
        });
        
        /**
         * Filtrage des informations 
         */
        const lessons = resultsLessons.map(element => {
            const lesson = {};
            lesson.id = element.id;                        
            lesson.title = element.title;
            lesson.tags = element.tags;
            lesson.slug = element.slug;
            lesson.created_at =  element.formatedCreationDate;  
            return lesson;
        });
        return res.json(lessons);  
    }
};
module.exports = lessonController;