/**
 * ce middleware permet:
 * - de verifier le format de l'id utilisateur
 * - de confirmer si l'action est faite par le propritaire ou un admin
 * => si true => next
 * => si false=> throw error 
 */

/**role utilisateur */
const userRole = require('../helpers/userRole');
module.exports = (req, res, next)=>{    
    /**
     * récuperation id utilisateur
     * 
     * !!! pour lessonController , userId est present dans req.body !!!!
     * 
     */

    const userId = req.params.userId ? parseInt(req.params.userId, 10) : parseInt(req.body.userId, 10);

    //id pas au format numeric
    if(isNaN(userId)){
        throw ({message: 'le format de l\'identifiant utilisateur est incorrect', statusCode:'400'});
    }

    /** données utilisateur absent */
    if(!userId){
        throw ({message: 'l\'identifiant utilisateur est manquant', statusCode:'400'});
    }

    /** Seule un admin ou l'utilisateur peut effectuer cette action */
    if( userId !== parseInt(req.payload.userId, 10) && req.payload.role < userRole.admin){
        throw ({message: 'vous n\'est pas autorisé a executer cette action', statusCode:'403'});
    }
    /** transfert de l'id utilisateur */
    req.userId = userId;
    next();
};