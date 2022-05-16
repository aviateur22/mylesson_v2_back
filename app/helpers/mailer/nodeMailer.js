const nodemailer = require('nodemailer');

const mailer = {
    /**
     * configuration de nodemailer
     */
    transporterConfig: ()=>{
        return (
            nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'ctoutweb@gmail.com', // generated ethereal user
                    pass: 'jbqpoqmgduvtfdvu', // generated ethereal password
                },
            })
        );
    },

    /**
     * envoie d'un email pour réinitialisation du mot de passe
     * @param {Text} to
     * @param {Text} templateHtml
     * @param {Text} link
     */
    passwordLostMail: async(transporter, to, templateHtml)=>{       
        let info = await transporter.sendMail({
            from: '"MyDevLesson 🔨" <ctoutweb@gmail.com>',
            to: to,
            subject: 'Réinitialisation de votre mot de passe ✔',
            html: templateHtml,
        });
    }

}
module.exports = mailer