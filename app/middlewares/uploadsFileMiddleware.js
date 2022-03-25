/** multer */
const multer = require('multer');
/**genration UUID */
const uuidGenerator = require('../helpers/security/uuidGenerator');

const upload = {
    uploadImage : multer.diskStorage({
        destination: function(req, file, cb) {         
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
                cb(null, 'uploads/');
            } else {
                /** le format de l'image n'est pas correcte */
                cb({message: 'seules les images au format JPEG et PNG sont acceptées', statusCode:'400'});
            }        
        },
        /** si le format est validé on génére un identifiant unique est on la stock */
        filename: function(req, file, cb) {
            /** genration d'un uuid pour l'image */
            const uniqueSuffix = uuidGenerator();
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    })
};
module.exports = upload;