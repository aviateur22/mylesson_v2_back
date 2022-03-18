const database = require('./databaseController');
const lesson = require('./lessonController');
const markdown = require('./markdownController');
const user = require('./userController');
const error = require('./errorController');

module.exports = {database, lesson, markdown, user, error};