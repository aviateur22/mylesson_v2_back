const lesson = require('./lessonController');
const markdown = require('./markdownController');
const user = require('./userController');
const tag  = require('./tagController');
const admin = require('./adminController');
const thematic = require('./thematicController');
module.exports = { lesson, markdown, user, tag, thematic, admin};