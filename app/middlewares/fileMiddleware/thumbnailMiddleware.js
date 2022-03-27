/** librairie pour creation thumbnail */
const sharp = require('sharp');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

module.exports = async(req, res, next)=>{
    /** si image à telecharger présente */
    if(req.file){
        /** recuperation du nom du fichier */
        const { filename: image} = req.file;
        
        /** nom de la thumbnail */
        const imageName = image.replace('image','thumbnail');
        
        /** repo pour upload */
        const uploadPath = process.env.UPLOAD_PATH + imageName;

        /** creation d'un thumnail */
        const t = await sharp(req.file.path).resize(50).toFile(uploadPath);

        /** creation de l'object a renvoyer */
        const thumbnail = {
            filename: imageName,
            path: uploadPath
        };

        /** suppression de l'image original */
        await unlinkFile(req.file.path);       

        req.thumbnail =thumbnail;
               
        return next();
    }
    return next();
};