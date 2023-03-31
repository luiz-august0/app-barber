require('dotenv').config();
const nodemailer = require("nodemailer");

export default async function sendEmail(email, link) {
    const send = async() => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.EMAILPASS
            },
        });
      
        await transporter.sendMail({
            from: "Suporte Barbeiro App",
            to: email,
            subject: "Recuperação de Senha",
            html: '<p>Olá,</p><p>Você solicitou a recuperação de senha, por gentileza, acesse o link a baixo para realizar a troca de sua senha.<br></p><p>' + 
                '<u>' + link + '</u></p>Caso você não tenha feito essa solicitação, sugerimos que verifique suas informações de segurança o quanto antes.</p>'
        });
    }

    try {
        send();   
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }
}