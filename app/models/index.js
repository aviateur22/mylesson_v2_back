const User = require('./user');
const Role = require('./role');
const Tag = require('./tag');
const Lesson = require('./lesson');
const lessonTag = require('./lessonTag');

User.belongsTo(Role,{
    foreignKey:'role_id',
    as:'role'
});

Lesson.belongsTo(User,{
    foreignKey:'user_id',
    as:'user'
});

Lesson.belongsToMany(Tag,{
    as:'tags',
    through:'lesson_has_tag'
});

Tag.belongsToMany(Lesson,{
    as:'btm_lesson',
    through:'lesson_has_tag'
});

module.exports = { User, Role, Tag, Lesson, lessonTag};