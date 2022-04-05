
const {promises: Fs} = require('fs');
const logger = require('../../helpers/logger');
const path = require('path');

/** verification presence de dossier */
module.exports = {
    /**
     * Vérification existance dossier d'upload dans le server
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     * @returns [next | throw error]
     */
    uploadFolder: async(req, res, next)=>{
        try {
            console.log(path.join(process.cwd() +process.env.UPLOAD_PATH_IMAGE))
            /** dossier d'upload */
            const uploadPath = path.join(process.cwd() +process.env.UPLOAD_PATH_IMAGE);        
            /** verification existance du path upload */
            await Fs.access(uploadPath);
            next();
        } catch (error) {           
            throw ({ message: error, statusCode: 500 });
        }
    }
};