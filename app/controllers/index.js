const lesson = require('./lessonController');
const markdown = require('./markdownController');
const user = require('./userController');
const tag  = require('./tagController');
const admin = require('./adminController');
const thematic = require('./thematicController');
const notification = require('./notificationController');
module.exports = { lesson, markdown, user, tag, thematic, admin, notification};