/**
 * middleware pour la suppression des cookies lors de la deconnexion
 * @param {Object} res 
 * @param {Object} next 
 */
const deleteCookieMiddleware = (_, res, next)=>{
    res.clearCookie('authorization');
    next();
};
module.exports = deleteCookieMiddleware;