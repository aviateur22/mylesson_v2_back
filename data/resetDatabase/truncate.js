require('dotenv').config();
const resetDatabaseHelper = require('../../app/helpers/resetDatabase');
const pg = require('pg');

/**
 * Reset du de la base de données
 */
module.exports = (async() => {  
    const client = new pg.Client(process.env.PGURL);
    try {        
        client.connect((err)=>{
            if(err){
                console.log('failed database connection: ' + err.stack);
                return;
            }
            console.log('success database connection');
        });

        const resetDatabase = resetDatabaseHelper(client);
        const truncate = await resetDatabase.truncateDatabase();
        const seeding = await resetDatabase.seedingDatabase();
        if(truncate && seeding){
            client.end();
            return console.log('truncate database ok');
        }
        client.end();
        return console.log('echec truncate database');        
    } catch (error) {
        client.end();
        return console.log('echec truncate database');   
    }    
})();