/**
 * Renvoie la duréée d'un JWT suivant son application
 */
module.exports = {
    /**connexion client */
    login: { expiresIn : '1800s'},

    /**réinitalisation du mot de passe */
    reinitializePassword: { expiresIn: '172800s'},

    /**envoir formulaire  */
    std: { expiresIn: '900s'},

    /** personne non connecté */
    visitor: { expiresIn: '900s'}
};