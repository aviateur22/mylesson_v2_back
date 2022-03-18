const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class Role extends Model{}

Role.init({
    name : DataTypes.STRING
},{
    sequelize,
    tableName:'role'
});
module.exports = Role;