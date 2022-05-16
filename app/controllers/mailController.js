const fileReader = require('../helpers/fileReader');
const nodemailer = require('nodemailer');

const mailController = {
    /**
     * envoie email
     */
    sendEmail: async(req, res, next)=>{
        const templateHtml= await fileReader('app/static/template/email.html');
        console.log(templateHtml)
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'ctoutweb@gmail.com', // generated ethereal user
                pass: 'jbqpoqmgduvtfdvu', // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"MyDevLesson 🔨" <ctoutweb@gmail.com>', // sender address
            to: 'aviateur22@hotmail.fr',
            subject: 'Réinitialisation de votre mot de passe ✔',
            html: templateHtml,
        });

        res.status(200).json({
            message: 'email envoyé'
        });
    },    
};

module.exports = mailController;