/**
 * URL et auth associé
 */
const urlParameters =(userRole)=>([
    //Page accessible uniquement sans connexion
    {'view':'/views/partials/login.html' ,'user-role': userRole.unknow},
    {'view':'/views/partials/signup.html' ,'user-role': userRole.unknow},
    //page accessible par connexion - sans role
    {'view':'/views/partials/account.html' ,'user-role': userRole.user},
    //page accessible par connexion - role teacher 
    {'view':'/views/partials/newLesson.html' ,'user-role': userRole.teacher},
    //page accessible par connexion - role admin 
    {'view':'/views/partials/database.html' ,'user-role': userRole.admin},    
]);
module.exports = urlParameters;