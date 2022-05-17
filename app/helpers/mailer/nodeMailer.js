/** nodeMailer */
const nodemailer = require('nodemailer');

/**lecture de fichier */
const fileReader = require('../fileReader');

/**chiffrage AES */
const AES = require('../security/aes');

/**
 * Envoie email pour:
 *  activation du compte 
 *  reset mot de passe
 */
class Mailer{    
    /*Initialisation du module AES */
    aes(){
        return new AES();
    }
    
    /**
     * 
     * @param {Text} emailType [ resetPassword|activateAccount ] - type d'email a envoyer
     * @param {Text} to - adresse mail d'envoie
     * @param {Number} userId - id de l'utilisateur
     * @param {Text} tokenMail - token 
     */
    constructor(emailType, to, userId, tokenMail) { 
        this.to = to;
        this.userId = userId;
        this.tokenMail = tokenMail;
        this.emailType = emailType;

        if(!this.to || !this.userId || !this.tokenMail || !this.emailType){
            throw ({message: 'données manquante pour configurer l\'email', statusCode:'400'});
        }
    }

    /**
     * configuration de nodemailer
     */
    transporterConfig(){
        return (
            nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_ACCOUNT, // generated ethereal user
                    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
                },
            })
        );
    }

    /**
     * envoie d'un email pour réinitialisation du mot de passe
     * @param {Text} to
     * @param {Text} templateHtml
     * @param {Text} link
     */
    async sendEmail(){  
        /** création du lien pour activer l'action */
        await this.createLink();

        /**envoie de l'email */
        let info = await this.transporterConfig().sendMail({
            from: '"MyDevLesson 🔨" <ctoutweb@gmail.com>',
            to: this.to,
            subject: 'Réinitialisation de votre mot de passe ✔',
            html: this.templateHtml,
        });
    }

    /**
     * chiffrage AES de l'id utilisateur
     */
    async encryptUserId(){
        const userIdEncrypt = await this.aes().encrypt(this.userId.toString());
        this.userIdEncrypt = userIdEncrypt;
    }

    /**chiffrage AES du code secret avec le userId */
    async encrypteSecretCode(){
        /**code secret */
        let secretURLCode = process.env.SECRET_URL_WORD;

        /**ajout du userID */
        secretURLCode = secretURLCode.replace(':userId', this.userId);

        /**chiffrage */
        this.secretURLCodeEncrypt = await this.aes().encrypt(secretURLCode);
    }

    /**
     * création du link mis dans l'email pour activer un compte ou reset le mot de passe
     * @param {Text} emailType - type d'email a envoyer
     */
    async createLink(){
        /**chiffrage userId*/
        await this.encryptUserId();

        /**chiffrage du codesecret */
        await this.encrypteSecretCode();

        /** uri de la requete */
        let baseUri;

        /**link a envoyer par email */
        if(process.env.NODE_ENV ==='DEV'){
            baseUri = 'http://localhost:8080';
        } else {
            baseUri = 'https://www.mydevlesson.com';
        }

        /**création du lien de l'email */        
        switch (this.emailType){
        /** reste du mot de passe */
        case 'resetPassword': 
            /** ficheir template html */
            this.templateHtml = await fileReader('app/static/template/resetPassword.html');

            /**template de chargé */
            if(this.templateHtml != null){  
                /**mise a jour du lien dans le template */              
                this.templateHtml = this.templateHtml.replace(':xxxx',
                    baseUri +'/users/' + this.userIdEncrypt +'/reset/' + this.secretURLCodeEncrypt + '/lost-password/token/'+ this.tokenMail); 
                return;
            }            
            throw ({message: 'données manquante pour configurer l\'email', statusCode:'400'});

        /** activation du compte */
        case 'accountActivated': 
        /** ficheir template html */
            this.templateHtml = await fileReader('app/static/template/activateAccount.html');

            /**template de chargé */
            if(this.templateHtml != null){
                /**mise a jour du lien dans le template */ 
                this.templateHtml = this.templateHtml.replace(':xxxx',
                    baseUri +'/users/' + this.encryptUserId +'/activate/' + this.secretURLCodeEncrypt + '/activate-account/token/'+ this.tokenMail); 
                return; 
            }            
            throw ({message: 'données manquante pour configurer l\'email', statusCode:'400'});
        default :throw ({message: 'données manquante pour configurer l\'email', statusCode:'400'});
        }
    }
}
module.exports = Mailer;