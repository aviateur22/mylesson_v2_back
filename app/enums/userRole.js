const userRole = {
    //utilisateur non connecté
    unknow : '0',

    //itilisateur connecté
    user : '1',

    //utilisateur pouvant poster
    teacher :'2',

    //utilisateur pouvant modifier les droits utilisateurs
    admin :'3',

    //utilisateur pouvant acceder à la database
    superAdmin :'4'
};
module.exports = userRole;