/**
 * Renvoie erreur 404
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 * @returns 
 */
module.exports=(req, res, next)=>{
    return res.status(404).json({message:'path invalide'});
};