require('dotenv').config();
const resetDatabaseHelper = require('../../app/helpers/resetDatabase');
const pg = require('pg');

/**
 * Reset du de la base de données
 */
module.exports = (async() => {  
    const client = new pg.Client(process.env.DATABASE_URL);
    try {        
        client.connect((err)=>{
            if(err){
                console.log('failed database connection: ' + err.stack);
                return;
            }
            console.log('success database connection');
        });

        const resetDatabase = resetDatabaseHelper(client);
        const reset = await resetDatabase.resetDatabase();
        const seeding = await resetDatabase.seedingDatabase();
        if(reset && seeding){
            client.end();
            return console.log('reset database ok');
        }
        client.end();
        return console.log('echec reset database');        
    } catch (error) {
        client.end();
        return console.log('echec reset database');   
    }    
})();