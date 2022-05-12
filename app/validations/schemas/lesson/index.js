const lessonSaveSchema = require('./lessonSaveSchema');
const lessonDeleteSchema = require('./deleteLessonSchema');
const lessonFilterByTagShema = require('./filterLessonByTag');
const requestLessonAdminCheck = require('./requestAdminLessonCheck');

module.exports = { lessonSaveSchema, lessonDeleteSchema, lessonFilterByTagShema, requestLessonAdminCheck } ;