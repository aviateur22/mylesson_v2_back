const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class User extends Model{}

User.init({
    login : DataTypes.STRING,
    email :  DataTypes.STRING,
    password : DataTypes.STRING,
    token: DataTypes.STRING
},{
    sequelize,
    tableName:'user'
});
module.exports = User;