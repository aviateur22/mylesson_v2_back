const registerUserSchema = require('./registerUserSchema');
const updateUserSchema = require('./updateUserSchema');
const loginUserSchema = require('./loginUserSchema');
const updatePasswordSchema = require('./updatePasswordSchema');
const requestUpgradeRole = require('./requestUpgradeRole');

module.exports = { registerUserSchema, updatePasswordSchema, loginUserSchema, updateUserSchema, requestUpgradeRole };