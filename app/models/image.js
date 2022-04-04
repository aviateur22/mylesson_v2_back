const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class Image extends Model{}

Image.init({

    name : DataTypes.STRING
},{
    sequelize,
    tableName:'image'
});
module.exports = Image;