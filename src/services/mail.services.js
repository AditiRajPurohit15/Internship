const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "aditipurohit1505@gmail.com",
        pass: "jsiagxrwddsqjmdl",
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