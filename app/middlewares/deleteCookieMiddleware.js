/**
 * middleware pour suppression de cookie
 * @param {Object} res 
 * @param {Object} next 
 */
const deleteCookieMiddleware = (_, res, next)=>{
    res.clearCookie('connect.sid', {path: '/'}).
        clearCookie('ident', {path: '/'});
    next();
};
module.exports = deleteCookieMiddleware;