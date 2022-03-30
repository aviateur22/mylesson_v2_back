const sequelize = require('../databases/client');
const {DataTypes, Model} = require('sequelize');

class Link extends Model{}

Link.init({
    logo_url : DataTypes.STRING
}, {
    sequelize,
    tableName:'link'
});
module.exports = Link;