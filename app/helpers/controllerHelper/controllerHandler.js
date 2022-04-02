/**
 * Wrapper pour les controllers
 * @returns {Object} - En cas d'erreur, renvois vers le controller.error
 */
module.exports = (controller)=> async(req, res, next)=>{
    try {
        await controller(req, res, next);
    } catch (error) {
        console.log(error);
        /**custom erreur ayant un schéma d'erreur */   
        return next(error);    
    }
};