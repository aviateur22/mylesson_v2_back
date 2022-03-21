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
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** pas de données sur le userRole */
        if(!userRole.user){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        if(req.payload.role < userRole.user){                       
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }
        return next();    
    },

    /**
     * droit en écriture - role > 2
     */
    writer:(req, _, next) => {        
        /** Pas de données en provenance du JWT */
        if(!req.payload){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** pas de données sur le userRole */
        if(!userRole.writer){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }
        
        /** roleId insuffisant */
        if(req.payload.role < userRole.writer){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }
        return next();  
    },

    /**
     * Page avec user.level > 3
     */
    admin: (req, _, next)=>{        
        /** Pas de données en provenance du JWT */
        if(!req.payload){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** pas de données sur le userRole */
        if(!userRole.admin){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }   
        
        if(req.payload.role < userRole.admin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }
        next();
    },

    /**
     * Page avec user.level > 4
     */
    superAdmin: (req,_,next)=>{
        /** Pas de données en provenance du JWT */
        if(!req.payload){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** Pas de données sur le role utilisateur */
        if(!req.payload.role){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }

        /** pas de données sur le userRole */
        if(!userRole.superAdmin){
            throw ({ message: 'données manquant pour confirmer les privilèges', statusCode:'400' });
        }   
          
        if(req.payload.role < userRole.superAdmin){
            throw ({message: 'vous n\'êtes pas autorisé a executer cette action', statusCode:'403'});
        }
        next();      
    }
};
module.exports = roleMiddleware;