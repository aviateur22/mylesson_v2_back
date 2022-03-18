/**
 * generation de token aléatoire
 * @param {Number} tokenLength - longueur du token
 * @returns {string} token
 */
module.exports = async(tokenLength) =>{
    try {
        /**tableau de char */
        const charArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','!','?', ':', '@', '*'];
        let token= null;
        /**recuperation aléatoire */
        await (async()=>{
            for(let i = 1; i <= tokenLength; i++) { 
                let randomNumber = Math.floor(Math.random() * (tokenLength - 0)) + 0;
                if(token){
                    token = token + charArray[randomNumber + 1];
                } else {
                    token = charArray[randomNumber + 1];
                }
            }
        })();
        return token;
    } catch (error) {
        console.log(error);        
    }    
};