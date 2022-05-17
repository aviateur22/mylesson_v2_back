/**
 * schema de validataion pour les admins
 */
const changePrivilege = require('./changePrivilege');
const deleteUserSchema = require('./deleteUserSchema');
const deleteLessonSchema = require('./deleteLessonSchema');

module.exports = { changePrivilege, deleteUserSchema, deleteLessonSchema } ;