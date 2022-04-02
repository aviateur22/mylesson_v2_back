const User = require('./user');
const Role = require('./role');
const Tag = require('./tag');
const Lesson = require('./lesson');
const lessonTag = require('./lessonTag');
const Link = require('./link');
const UserLink = require('./userLink');

User.belongsTo(Role,{
    foreignKey:'role_id',
    as:'role'
});

Lesson.belongsTo(User,{
    foreignKey:'user_id',
    as:'user'
});

Lesson.belongsToMany(Tag,{
    as:'lessonsTags',
    through:'lesson_has_tag'
});
Tag.belongsToMany(Lesson,{
    as:'tagsLessons',
    through:'lesson_has_tag'
});

User.belongsToMany(Link,{    
    as: 'links',
    through: UserLink
});

Link.belongsToMany(User,{
    as: 'users',
    through: UserLink
});

module.exports = { User, Role, Tag, Lesson, lessonTag, Link, UserLink};