/** multer */
const multer = require('multer');
const path = require('path');

/**genration UUID */
const uuidGenerator = require('../../helpers/security/uuidGenerator');

/** gestion multer pour stocker une image sur le server */
const upload = {  

    uploadImage : multer.diskStorage({
        /** verification du format du document et parametrage de uploads path */
        destination: async function(req, file, cb) {                       
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){                                      
                (null, path.join(process.cwd(),process.env.UPLOAD_PATH_IMAGE));                
            } else {
                /** le format de l'image n'est pas correcte */
                cb({message: 'seules les images au format JPEG et PNG sont acceptées', statusCode:'400'});
            }        
        },
        /** si le format est validé on génére un identifiant unique est on la stock */
        filename: function(req, file, cb) {
            console.log('ici');  
            /** genration d'un uuid pour l'image */
            const uniqueSuffix = uuidGenerator();
            cb(null, file.fieldname + '-' + uniqueSuffix +'.png');
        }
    })
};
module.exports = upload;