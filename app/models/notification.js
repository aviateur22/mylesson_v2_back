const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class Notification extends Model{}

Notification.init({
    text : DataTypes.STRING,
    new: DataTypes.BOOLEAN
},{
    sequelize,
    tableName:'notification'
});
module.exports = Notification;