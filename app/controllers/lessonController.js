const Sequelize = require('sequelize');
const sanitizer = require('sanitizer');
const {Lesson, Tag, User, lessonTag} = require('../models/index');
const CRYPTO_AES = require('../helpers/security/aes');
const aes = new CRYPTO_AES();
const userRole = require('../helpers/userRole');
const LessonTag = require('../models/lessonTag');

const lessonController = {

    /**
     * upload file
     */
    upload:()=>{

    },

    /**
     * envoie d'un token de formulaire pour une nouvelle lecon
     */
    getTokenByUserId: (req, res, next)=>{
        /** récuperation du token génré */
        const token = res.formToken;

        /** envoie du token */
        res.status(200).json({
            token
        });
    },

    /**
     * Création d'une nouvelle leçon
     */
    create: async(req, res, next) => {
        //récupération de l'utilisateur
        const userId = req.userId;

        /** si pas de userId */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }

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
            user_id: userId ,
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
            include:['lessonsTags',
                {
                    association: 'user',
                    include:['links']        
                }
            ]
        });         
        res.status(201).json({
            id: createLesson.id,
            title: createLesson.title,
            content: createLesson.content,
            tags: createLesson.lessonsTags,
            autor: createLesson.user.login,
            links: createLesson.user.links,
            avatarKey: createLesson.user.avatar_key,
            slug: createLesson.slug,
            created: createLesson.formatedCreationDate,
            updated: createLesson.formatedUpdateDate,
            token: req.body.formToken  
        });
    },
    
    /**
     * Récupération de toute les lessons
     */
    getAll: async(req, res, next)=>{
        const lessons = await Lesson.findAll({
            include:{
                model: Tag, as: 'lessonsTags'
            }
        });
        return res.json(lessons);
    },

    /**
     * update d'une leçon
     */
    updateById: async(req, res, next)=>{
        //récupération de l'utilisateur
        const userId = req.userId;

        /** si pas de userId */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }

        //recuperation id de la lesson
        const lessonId = parseInt(req.params.lessonId, 10);

        //id pas au format numeric
        if(isNaN(lessonId)){
            throw ({message: 'le format de l\'identifiant de la leçon est incorrect', statusCode:'400'});
        }

        /** id lecon manquant */
        if(!lessonId){
            throw ({message: 'l\'identifiant de la leçon est manquant', statusCode:'400'});
        }

        //recuperation des données du formulaire
        const { tagId, title, content } = req.body;
        

        /** données lecon manquantes */
        if(!tagId || !title || !content){
            throw ({message: 'le titre, tag et contenu de la leçon sont obligatoire', statusCode:'400'});
        }

        /**Nettoyage des données utilisateur */
        const contentEscape = sanitizer.escape(content);
        const titleEscape = sanitizer.escape(title);

        //création d'un tableau tags id
        const tags = tagId.split('/').map(tag => parseInt(tag, 10));

        //vérification des ids de tag
        tags.forEach(tag => {
            if(isNaN(tag)){
                throw ({ message:  'le format des tags n\'est pas valide', statusCode:'400' });
            }            
        });

        const lesson = await Lesson.findByPk(lessonId);

        /** aucun id de la leçon n'est trouvé  */
        if(!lesson){
            throw ({message: 'la leçon n\'est pas présente en base de données', statusCode:'400'});
        }

        /** Seule un admin ou le propriétaire de la lecon peut executer cette action */
        if(userId !== parseInt(lesson.user_id, 10) && req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }

        /** mise a jour des données */
        const newLessonData = { ...lesson, ...{ title: titleEscape, content: contentEscape } };

        let updateLesson = await lesson.update({
            ...newLessonData
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
            include:['lessonsTags',
                {
                    association: 'user',
                    include:['links']        
                }
            ]
        });   

        return res.status(200).json({     
            id: updateLesson.id,       
            title: updateLesson.title,
            content: updateLesson.content,
            tags: updateLesson.lessonsTags,
            autor: updateLesson.user.login,
            links: updateLesson.user.links,
            avatarKey: updateLesson.user.avatar_key,
            slug: updateLesson.slug,
            created: updateLesson.formatedCreationDate,
            updated: updateLesson.formatedUpdateDate,            
            token: res.formToken
        });
    },
   
    /**
     * Recuperation leçon par son id
     * @returns {Object} lesson 
     */
    getById: async(req, res, next)=>{        
        /**Vérification id */
        const lessonId =parseInt(req.params.lessonId, 10);
        
        /** mauvais format de lecon id */
        if(isNaN(lessonId)){
            throw ({message: 'le format de l\'identifiant de la leçon est incorrect', statusCode:'400'});
        }      

        /** lecon id manquant */
        if(!lessonId){
            throw ({message: 'l\'identifiant de la leçon est manquant', statusCode:'400'});
        }

        const lesson =await Lesson.findByPk(lessonId, {
            include:['lessonsTags', 
                {
                    association: 'user',
                    include:['links']        
                }
            ]
        });

        /** pas de lecon */
        if(!lesson){
            return res.status(204).json({});
        }
        /** token du formulaire */
        const token = req.body.formToken;
        
        /**Renvoide la leçon */
        return res.status(200).json({
            title: lesson.title,
            content: lesson.content,
            tags: lesson.lessonsTags,
            autor: lesson.user.login,
            links: lesson.user.links,
            avatarKey: lesson.user.avatar_key,
            slug: lesson.slug,
            created: lesson.formatedCreationDate,
            updated: lesson.formatedUpdateDate,
            token           
        });        
    },

    /**
     * Suppression de une leçon
     */
    deleteById: async(req, res, next)=>{
        /** récuperation userId */
        const userId = req.userId;

        /** si pas de userId */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }

        //récupération id de la lesson
        const lessonId = parseInt(req.params.lessonId, 10);

        //id pas au format numeric
        if(isNaN(lessonId)){
            throw ({message: 'le format de l\'identifiant de la leçon est incorrect', statusCode:'400'});
        }

        /** id lecon manquant */
        if(!lessonId){
            throw ({message: 'l\'identifiant de la leçon est manquant', statusCode:'400'});
        }

        const lesson = await Lesson.findByPk(lessonId);

        /** aucun id correspondant  */
        if(!lesson){
            throw ({message: 'la leçon n\'est pas présente en base de données', statusCode:'400'});
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

        /** lecon pas trouvée */
        if(!deleteLesson){
            throw ({ message: 'la leçon n\'est pas présente en base de données', statusCode: 404});
        }

        return res.status(204).json({
            lessonId: lesson.id
        });
    },
   
    /**
     * Récuperation de toutes les lecons d'un user
     * @returns {object} lessons - Leçons créées par l'utilisateur
     */
    getByUserId: async(req, res, next)=>{       
        //récupération de l'utilisateur
        const userId = req.userId;
      
        /** données utilisateur absent */
        if(!userId){
            throw ({message: 'votre identifiant utilisateur est manquant', statusCode:'400'});
        }
      
        /**requete sur les leçon utilisateurs */
        const resultsLessons = await Lesson.findAll({
            where:{
                user_id: userId 
            },
            include: ['lessonsTags', 'user']
        });
        
        /**
         * Filtrage des informations 
         */
        const lessons = resultsLessons.map(element => {
            const lesson = {};
            lesson.id = element.id;                        
            lesson.title = element.title;
            lesson.lessonsTags = element.lessonsTags;
            lesson.slug = element.slug;
            lesson.content = element.content,
            lesson.created_at =  element.formatedCreationDate;  
            return lesson;
        });
        return res.json(lessons);  
    },

    /**
     * Renvoie les lecons filtrer par Tag
     */
    getLessonByTag: async(req, res, next)=>{ 
        /** récuperation de la liste de tags */        
        const tags =req.body.tags;  

        /** si pas de tags alors on renvoies toutes les lecons */
        if(tags.length === 0){
            const lessonByTag = await Lesson.findAll({
                include:['lessonsTags']
            });

            return res.status(200).json(lessonByTag);
        }

        /** récuoerations des id de lecons associés au tags */
        const lessonIdByTag = await LessonTag.findAll({
            where:{
                tag_id: tags
            },
            attributes:['lesson_id']
        });        
      
        /** formate les ids des lecons */
        const lessonsId = lessonIdByTag.map(element => element.lesson_id);

        /** recuperation de toutes les lecons */
        const lessonByTag = await Lesson.findAll({            
            where:{
                id: lessonsId
            },
            include:['lessonsTags']
        });  
        
        return res.status(200).json(lessonByTag);
    },

};
module.exports = lessonController;