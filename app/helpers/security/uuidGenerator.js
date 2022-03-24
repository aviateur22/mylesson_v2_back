/** génération d'un identifiant unique */
const { v4: uuidv4 } = require('uuid');
module.exports =()=>{
    const uuid = uuidv4();
    return uuid;
};