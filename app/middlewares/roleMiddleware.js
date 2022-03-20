/**
 * définie les roles utilisateurs pour les routers
 */
const userRole = require('../helpers/userRole');

const roleMiddleware = {
    /**
     * Page avec authentification obligatoire 
     * user.level > 1
     */
    user: (req, _, next) =>{
        /** Pas de données en provenance du JWT */
        if(!req.payload){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** pas de données sur le userRole */
        if(!userRole.user){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'500' });
        }

        if(req.payload.role < userRole.user){                       
            throw ({message: 'connection requise', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        return next();    
    },

    /**
     * droit en écriture - role > 2
     */
    writer:(req, _, next) => {        
        /** Pas de données en provenance du JWT */
        if(!req.payload){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** pas de données sur le userRole */
        if(!userRole.writer){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'500' });
        }
        
        /** roleId insuffisant */
        if(req.payload.role < userRole.writer){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }
        return next();  
    },

    /**
     * Page avec user.level > 3
     */
    admin: (req, _, next)=>{        
        /** Pas de données en provenance du JWT */
        if(!req.payload){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** pas de données sur le userRole */
        if(!userRole.admin){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'500' });
        }   
        
        if(req.payload.role < userRole.admin){
            throw ({message: 'action interdite', statusCode:'403', resetAuth: true , redirect :'/', error: true});
        }
        next();
    },

    /**
     * Page avec user.level > 4
     */
    superAdmin: (req,_,next)=>{
        /** Pas de données en provenance du JWT */
        if(!req.payload){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'vous n\'avez pas le droit d\'effectuer cette action', statusCode:'403' });
        }

        /** pas de données sur le userRole */
        if(!userRole.superAdmin){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'500' });
        }   
          
        if(req.payload.role < userRole.superAdmin){
            throw ({message: 'action interdite', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        next();      
    }
};
module.exports = roleMiddleware;