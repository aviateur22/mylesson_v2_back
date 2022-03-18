const { Sequelize }  = require('sequelize');

const sequilize = new Sequelize(process.env.PGURL,{
    define:{
        underscored:true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }    
});
module.exports=sequilize;