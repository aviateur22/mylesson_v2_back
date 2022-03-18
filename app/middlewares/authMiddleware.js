const userRole = require('../enums/userRole');

const authMiddleware ={
    /**
     * Page avec authentification obligatoire 
     * user.level > 1t 
     */
    connected :(req,_,next) =>{
        if(!req.session.user){                       
            throw ({message: 'connection requise', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        next();    
    },

    /**
     * Page avec user.level > 2
     */
    teacher : (req,_,next)=>{  
        if(req.session.user.role_id < userRole.teacher){
            throw ({message: 'action interdite', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        next();  
    },

    /**
     * Page avec user.level > 3
     */
    admin :(req,_,next)=>{   
        if(req.session.user.role_id < userRole.admin){
            throw ({message: 'action interdite', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        next();
    },

    /**
     * Page avec user.level > 4
     */
    superAdmin :(req,_,next)=>{   
        if(req.session.user.role_id < userRole.superAdmin){
            throw ({message: 'action interdite', statusCode:'401', resetAuth: true , redirect :'/', error: true});
        }
        next();      
    }
};
module.exports = authMiddleware;