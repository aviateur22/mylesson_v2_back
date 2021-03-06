const User = require('./user');
const Role = require('./role');
const Tag = require('./tag');
const Lesson = require('./lesson');
const LessonTag = require('./lessonTag');
const Link = require('./link');
const UserLink = require('./userLink');
const Image = require('./image');
const Thematic = require('./thematic');
const Notification = require('./notification');
const UserNotification = require('./userNotification');

User.belongsTo(Role,{
    foreignKey:'role_id',
    as:'role'
});

Lesson.belongsTo(User,{
    foreignKey:'user_id',
    as:'user'
});


Tag.belongsTo(Image,{
    foreignKey: 'image_id',
    as: 'image'
});

Image.hasMany(Tag,{
    foreignKey: 'image_id',
    as:'tags'
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

User.belongsToMany(Notification, {
    as: 'notifications',
    through: UserNotification
});

Notification.belongsToMany(User, {
    as: 'users',
    through: UserNotification
});

Lesson.belongsTo(Thematic,{
    foreignKey: 'thematic_id',
    as: 'thematic'
});

Thematic.hasMany(Lesson,{
    foreignKey: 'thematic_id',
    as: 'thematics'
});

module.exports = { User, Role, Tag, Lesson, LessonTag, Link, UserLink, Image, Thematic, Notification, UserNotification };