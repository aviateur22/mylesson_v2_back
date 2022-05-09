const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class User extends Model{}

User.init({
    login : DataTypes.STRING,
    email :  DataTypes.STRING,
    password : DataTypes.STRING,
    request_upgrade_role: DataTypes.BOOLEAN,
    sex: DataTypes.STRING,
    avatar_key: DataTypes.STRING
},{
    sequelize,
    tableName:'user'
});
module.exports = User;