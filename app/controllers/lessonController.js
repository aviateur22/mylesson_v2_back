const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sanitizer = require('sanitizer');
const {Lesson, Tag, User, lessonTag} = require('../models/index');
const CRYPTO_AES = require('../helpers/security/aes');
const aes = new CRYPTO_AES();
const userRole = require('../helpers/userRole');

const lessonController = {

    /**
     * upload file
     */
    upload:()=>{

    },

    /**
     * Création d'une nouvelle leçon
     */
    create: async(req, res, next) => {
        //recuperation tagId, title, content
        const {tagId, title, content} = req.body;

        /**titre et content manquant */
        if(!title, !content){
            throw ({ message: 'le titre et contenu de la leçon ne peuvent pas être vide', statusCode:'422' });
        }

        /**id tag manquant */
        if(!tagId){
            throw ({ message: 'tags id absent', statusCode:'422' });
        }

        /**Nettoyage des données utilisateur */
        const contentEscape = sanitizer.escape(content);
        const titleEscape = sanitizer.escape(title);

        //création d'un tableau tags id
        const tags = tagId.split('/').map(tag => parseInt(tag, 10));

        //vérification des ids de tag
        tags.forEach(tag => {
            if(isNaN(tag)){
                throw ({ message:  'le format des tags n\'est pas valide', statusCode:'422' });
            }            
        });

        /** slug de la leçon*/
        const slug = titleEscape.trim().replace(/\s/g,'-');

        /** Création de le leçon */
        let createLesson = await Lesson.create({
            title: titleEscape,
            content : contentEscape,
            user_id: req.payload.id ,
            slug: slug    
        });

        const id = createLesson.id;
        
        /**Generation des tags */
        await (async()=>{
            /** stocks les promesses */
            const promises = [];
            tags.forEach((tag)=>{   
                const query =  lessonTag.create({                    
                    lesson_id: id,
                    tag_id: tag                    
                });         
                promises.push(query);
            });
            /** résolution des promesses */
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
    updateById: async(req, res, next)=>{
        //recuperation id de la lesson
        const lessonId = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(lessonId)){
            throw ({message: 'le format de l\'identifiant de la leçon est incorrect', statusCode:'422'});
        }

        /** id lecon manquant */
        if(!lessonId){
            throw ({message: 'l\'identifiant de la leçon est manquant', statusCode:'422'});
        }

        //recuperation des données du formulaire
        const { tagId, title, content } = req.body;

        //récupération de l'utilisateur
        const userId = parseInt(req.body.userId, 10);

        //id pas au format numeric
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'422'});
        }

        /** données lecon manquantes */
        if(!tagId || !title || !content){
            throw ({message: 'le titre, tag et contenu de la leçon sont obligatoire', statusCode:'422'});
        }

        /** données utilisateur absent */
        if(!userId){
            throw ({message: 'l\'identifiant utilisateur est manuqant', statusCode:'422'});
        }

        /**Nettoyage des données utilisateur */
        const contentEscape = sanitizer.escape(content);
        const titleEscape = sanitizer.escape(title);

        //création d'un tableau tags id
        const tags = tagId.split('/').map(tag => parseInt(tag, 10));

        //vérification des ids de tag
        tags.forEach(tag => {
            if(isNaN(tag)){
                throw ({ message:  'le format des tags n\'est pas valide', statusCode:'422' });
            }            
        });

        const lesson = await Lesson.findByPk(lessonId);

        /** aucun id correspondant  */
        if(!lesson){
            throw ({message: 'la leçon n\'est pas présente en base de données', statusCode:'422'});
        }

        /** Seule un admin ou le propriétaire de la lecon peut executer cette action */
        if(userId !== parseInt(lesson.user_id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        let updateLesson = await lesson.update({                
            title: titleEscape,
            content : contentEscape
        });

        /** suppression des anciens tags */
        await lessonTag.destroy({
            where:{                   
                lesson_id: lessonId
            }                                   
        });

        /** ajout des tags*/
        await (async()=>{
            const promises = [];           
            tags.forEach((tag)=>{   
                const query =  lessonTag.create({                    
                    lesson_id: lessonId,
                    tag_id: tag                    
                });         
                promises.push(query);
            });
            const outputs = await Promise.all(promises);
        })();

        /**Recuperation de la leçon */
        updateLesson = await Lesson.findByPk(lessonId,{
            include:{
                model: Tag, as: 'tags'
            }
        });
        return res.status(200).json(updateLesson);
    },
   
    /**
     * Recuperation leçon par son id
     * @returns {Object} lesson 
     */
    getById: async(req, res, next)=>{        
        /**Vérification id */
        const lessonId =parseInt(req.params.id, 10);
        
        /** mauvais format de lecon id */
        if(isNaN(lessonId)){
            throw ({message: 'le format de l\'identifiant de la leçon est incorrect', statusCode:'422'});
        }      
        
        /** lecon id manquant */
        if(!lessonId){
            throw ({message: 'l\'identifiant de la leçon est manquant', statusCode:'422'});
        }

        const lesson =await Lesson.findByPk(lessonId, {
            include:['tags','user']
        });

        /** pas de lecon */
        if(!lesson){
            return res.status(204).json({});
        }
        
        /**Renvoide la leçon */
        return res.status(200).json({
            title: lesson.title,
            content: lesson.content,
            tags: lesson.tags,
            autor: lesson.user.login,
            slug: lesson.slug,
            created: lesson.formatedCreationDate,
            updated: lesson.formatedUpdateDate            
        });        
    },

    /**
     * Suppression de une leçon
     */
    deleteById: async(req, res, next)=>{
        //récupération id de la lesson
        const lessonId = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(lessonId)){
            throw ({message: 'le format de l\'identifiant de la leçon est incorrect', statusCode:'422'});
        }

        /** id lecon manquant */
        if(!lessonId){
            throw ({message: 'l\'identifiant de la leçon est manquant', statusCode:'422'});
        }

        //récupération de l'utilisateur
        const userId = parseInt(req.body.userId, 10);

        //id pas au format numeric
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'422'});
        }

        const lesson = await Lesson.findByPk(lessonId);

        /** aucun id correspondant  */
        if(!lesson){
            throw ({message: 'la leçon n\'est pas présente en base de données', statusCode:'422'});
        }

        /** Seule un admin ou le propriétaire de la lecon peut executer cette action */
        if(userId !== parseInt(lesson.user_id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        const deleteLesson = await Lesson.destroy({
            where:{                   
                id: lessonId
            }                                   
        });

        return res.status(200).json({
            lessonId: lesson.id,
            title: lesson.title
        });
    },
   
    /**
     * Récuperation de toutes les lecons d'un user
     * @returns {object} lessons - Leçons créées par l'utilisateur
     */
    getByUserId: async(req, res, next)=>{       
        //récupération de l'utilisateur
        const userId = parseInt(req.params.id, 10);

        //id pas au format numeric
        if(isNaN(userId)){
            throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'422'});
        }

        /** données utilisateur absent */
        if(!userId){
            throw ({message: 'l\'identifiant utilisateur est manquant', statusCode:'422'});
        }
        
        /** Seule un admin ou le propriétaire de la lecon peut executer cette action */
        if(userId !== parseInt(req.payload.id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /**requete sur les leçon utilisateurs */
        const resultsLessons = await Lesson.findAll({
            where:{
                user_id :userId 
            }, 
            returning: true,               
            include:{ model: Tag, as: 'tags', attributes:['name'] }
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