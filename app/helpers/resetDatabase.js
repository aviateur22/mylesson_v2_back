const fileReader = require('./fileReader');

module.exports = (pg)=>({    

    /**
     * Reset de la base de données
     * @param {function} callback - 
     */
    resetDatabase : async()=>{
        try {
            //Lecture du fichier sql       
            const queryText = await fileReader('/data/database.sql');
            //excution de la requete sql
            await pg.query(queryText); 
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    /**
     * Envoie de données fictives
     * @param {function} callback - fonction appelée apres exection de la requete 
     */
    seedingDatabase : async()=>{
        try {
            //Lecture du fichier sql       
            const queryText = await fileReader('/data/data.sql');
            //excution de la requete sql
            await pg.query(queryText); 
            return true;                
        } catch (error) {
            console.log(error);
            return false;
        }        
    },

    truncateDatabase:async()=>{
        try {
            //Lecture du fichier sql       
            const queryText = await fileReader('/data/truncate.sql');
            //excution de la requete sql
            await pg.query(queryText); 
            return true;                
        } catch (error) {
            console.log(error);
            return false;
        }
    }
});