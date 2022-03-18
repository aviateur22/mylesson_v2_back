const crypto = require('crypto');
class CRYPTO_AES{
    algorithm = 'aes-256-cbc';
    bufferEncryption = 'base64';  
    key = process.env.AES_KEY;
    iv = process.env.AES_IV;   

    /**
     * chiffrement
     * @param {string} data - données a chiffrer
     * @returns {object}
     */
    encrypt = (data) => {
        try {
            const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
            const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);            
            return JSON.stringify({
                content: encrypted.toString(this.bufferEncryption)
            });
        } catch (err){
            throw (err);
        }
    };
    /**
     * dechiffrement 
     * @param {object} data 
     * @returns {string} -
     */
    decrypt = (data) => {
        try {           
            data = JSON.parse(data);         
            if(!data?.content){
                console.log('bcrypt - invalid data.content');
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