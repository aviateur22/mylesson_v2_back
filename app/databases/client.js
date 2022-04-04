const { Sequelize }  = require('sequelize');

let sequelize;

/** connection en production */
if(process.env.NODE_ENV === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL,        
        {
            dialectOptions:{
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            define:{
                underscored:true,
                updatedAt: 'updated_at',
                createdAt: 'created_at'            
            }
        });
} else {
    /** connection en local */
    sequelize = new Sequelize(process.env.DATABASE_URL,{
        define:{
            underscored:true,
            updatedAt: 'updated_at',
            createdAt: 'created_at'
        }
    });
}
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports=sequelize;