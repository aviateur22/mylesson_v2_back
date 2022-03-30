const sequelize = require('../databases/client');
const {DataTypes, Model} = require('sequelize');

class Link extends Model{}

Link.init({
    compagny_name : DataTypes.STRING,
    picture_name : DataTypes.STRING
}, {
    sequelize,
    tableName:'link'
});
module.exports = Link;