const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASSWORD,
    }
})

const sendMail = async(to, subject, html)=>{
    let newMail = {
        to,
        subject,
        html,
    }
    return await transporter.sendMail(newMail)
}

module.exports = sendMail