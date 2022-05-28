const registerUserSchema = require('./registerUserSchema');
const updateUserSchema = require('./updateUserSchema');
const loginUserSchema = require('./loginUserSchema');
const updatePasswordSchema = require('./updatePasswordSchema');
const requestUpgradeRole = require('./requestUpgradeRole');
const resetPasswordSchema = require('./resetPasswordSchema');
const userSendEmailPasswordSchema = require('./userSendEmailPasswordSchema');

module.exports = { registerUserSchema, updatePasswordSchema, loginUserSchema, updateUserSchema, requestUpgradeRole, resetPasswordSchema, userSendEmailPasswordSchema };