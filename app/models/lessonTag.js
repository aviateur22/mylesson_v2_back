const sequelize = require('../databases/client');
const {DataTypes,Model} = require('sequelize');

class LessonTag extends Model{}

LessonTag.init({
    lesson_id : DataTypes.NUMBER,
    tag_id: DataTypes.NUMBER
},{
    sequelize,
    tableName:'lesson_has_tag'
});
module.exports = LessonTag;