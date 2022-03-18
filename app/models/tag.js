const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class Tag extends Model{}

Tag.init({

    name : DataTypes.STRING
},{
    sequelize,
    tableName:'tag'
});
module.exports = Tag;