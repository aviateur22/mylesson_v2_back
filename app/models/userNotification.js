const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class UserNotification extends Model{}

UserNotification.init({    
    user_id: DataTypes.NUMBER,
    notification_id: DataTypes.NUMBER,
    user_source_id : DataTypes.NUMBER,
},{
    sequelize,
    tableName:'user_has_notification'
});
module.exports = UserNotification;