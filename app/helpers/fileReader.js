const path = require('path');
const {promisify} = require('util');
const fs = require('fs');

/**
 * Lecture d'un fichier
 * @param {string} filePath - chemin relatif du fichier
 * @returns {string} - contenu du fichier au format UTF8
 */
module.exports =async(filePath)=>{ 
    try {
        //chemin racine server
        const routePath = process.cwd();

        //path du fichier en lecture
        const dataFilePath = path.join(routePath ,filePath);

        //chargement lecture async
        const readFile =promisify(fs.readFile);

        //Lecture du fichier
        const textStream = await readFile(dataFilePath,'utf8');

        return textStream;            
    } catch (error) {
        return (error);
    }        
};