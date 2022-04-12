const sequelize = require('../databases/client');
const {DataTypes, Model} = require('sequelize');

class Thematic extends Model{}

Thematic.init({    
    name: DataTypes.STRING,
    image_name: DataTypes.STRING
},{
    sequelize,
    tableName:'thematic'
});
module.exports = Thematic;