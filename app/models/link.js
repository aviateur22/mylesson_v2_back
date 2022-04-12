const sequelize = require('../databases/client');
const {DataTypes, Model} = require('sequelize');

class Link extends Model{}

Link.init({
    compagny_name : DataTypes.STRING,
    image_name : DataTypes.STRING
}, {
    sequelize,
    tableName:'link'
});
module.exports = Link;