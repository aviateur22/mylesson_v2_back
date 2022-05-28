const crypto = require('crypto');
const base64 = require('./base64');
class CRYPTO_AES{
    algorithm = 'aes-256-cbc';
    bufferEncryption = 'base64';  
    key = process.env.AES_KEY;
    iv = process.env.AES_IV;   

    /**
     * chiffrement - suivi d'un encodage base64
     * @param {string} data - données a chiffrer
     * @returns {object}
     */
    encrypt = (data) => {
        try {
            /** chiffrement de la data */
            const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
            const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
            const dataStringify = JSON.stringify({
                content: encrypted.toString(this.bufferEncryption)
            });
            /** encodage base64 */
            const dataEncode = base64.encodeStringToBase64(dataStringify);
            return dataEncode;
        } catch (err){
            throw (err);
        }
    };
    /**
     * decodage base64 en UTF-8 suivi d'un déchiffrement
     * @param {object} data 
     * @returns {string} -
     */
    decrypt = (data) => {
        try {    
            /** conversion base64 -> UTF8*/       
            const DataDecode = base64.decodeBase64ToString(data);
            
            /** dechriffement données */
            data = JSON.parse(DataDecode);         
            if(!data?.content){
                throw 'bcrypt - invalid data.content';
            }
            let encryptedText = Buffer.from(data.content, this.bufferEncryption);    
            let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key),this.iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (err)
        {
            throw err;
        }
    };
}

module.exports = CRYPTO_AES;