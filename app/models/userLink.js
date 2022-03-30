const sequelize = require('../databases/client');
const {DataTypes, Model} = require('sequelize');

class UserLink extends Model{}

UserLink.init({
    user_id : DataTypes.NUMBER,
    link_id: DataTypes.NUMBER,
    link_url: DataTypes.STRING
}, {
    sequelize,
    tableName:'user_has_link'
});
module.exports = UserLink;