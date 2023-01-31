const nodemailer = require('nodemailer')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER,
      pass: process.env.GMAIL_PASSWORD
    }
});

function sendEmail(subject, username){
    let mailOptions = {
    from: process.env.SENDER,
    to: process.env.RECEIVER,
    subject: subject,
    text: "User : "+username+"\n\n\nSent from a NodeJS server."
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error)
        } else {
        console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = sendEmail