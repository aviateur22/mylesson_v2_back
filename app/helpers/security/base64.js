module.exports = {
    /**
     * Encode un string en base64
     * @param {string} string 
     * @returns {string} - chaine encodée en base64
     */
    encodeStringToBase64:(string)=>{
        const encodeString= Buffer.from(string,'base64');
        return encodeString;
    },

    /**
     * decode une chaine base64 en string
     * @param {string} string 
     * @returns {string} chaine
     */
    decodeBase64ToString:(string)=>{
        const decode = Buffer.from(string, 'utf-8');
        return decode;
    }
};