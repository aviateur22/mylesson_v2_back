const awsManager = require('../../helpers/aws');
module.exports = {

    /**Upload de fichier dans AWS S3 bucket */
    uploadAWSBucket: async(req, res, next)=>{
        /**si fichier thumbnail de recu */
        if(req.thumbnail){            
            const file = req.thumbnail;

            /** si image thumbnail */
            if(file){
                /** creatio d'un thumbnail */
                const upload = await awsManager.BucketUploadFile(file);
                
                /** renvoi d'un message d'erreur */
                if(upload.awsError){                    
                    throw ({awsError: upload.awsError});
                }                
                /** saubegarde de la clef de l'image */
                req.AWSUploadKey = upload.key;
            }
            
            return next();
        }
        return next();
    }
};