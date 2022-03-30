const awsManager = require('../../helpers/aws');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

module.exports = {

    /**Upload de fichier dans AWS S3 bucket */
    uploadAWSBucket: async(req, res, next)=>{
        /**si fichier thumbnail de recu */        
        if(req.thumbnail){            
            const file = req.thumbnail;

            /** si image thumbnail */
            if(file){
                /** création d'un thumbnail */
                const upload = await awsManager.BucketUploadFile(file);
                
                /** renvoi d'un message d'erreur */
                if(upload.awsError){         
                    /** suppression du thumbnail */
                    await unlinkFile(req.thumbnail.path);            
                    throw ({awsError: upload.awsError});
                }       
                
                /** suppression du thumbnail */
                await unlinkFile(req.thumbnail.path); 
               
                /** saubegarde de la clef de l'image */
                req.AWSUploadKey = upload.key;
            }
            
            return next();
        }
        return next();
    }
};