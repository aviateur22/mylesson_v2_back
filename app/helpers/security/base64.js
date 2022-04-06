module.exports = {
    /**
     * Encode un string en base64
     * @param {string} string 
     * @returns {string} - chaine encodée en base64
     */
    encodeStringToBase64:(string)=>{        
        const base64String = Buffer.from(string).toString('base64');
        return base64String;
    },

    /**
     * decode une chaine base64 en string
     * @param {string} string 
     * @returns {string} chaine
     */
    decodeBase64ToString:(string)=>{
        const decode = Buffer.from(string,'base64').toString('utf-8');
        return decode;
    }
};