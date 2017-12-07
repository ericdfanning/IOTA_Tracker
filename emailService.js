const mailer = require('nodemailer');
const serviceEmailAddress = require('./email.config.js').email;
const password = require('./email.config.js').password;
const template = require('./emailTemplate.js');
let transport = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: serviceEmailAddress,
    pass: password
  }
});

let mailOptions = {
  from: serviceEmailAddress,
  subject: 'IOTA PRICE HAS CHANGED BY A DOLLAR', // change the subject line to match your threshold amount
};

exports.sendEmail = (pricesObj) => {

  let options = {
    from: mailOptions.from,
    subject: mailOptions.subject,
    to: ['EMAIL_YOU_WANT_TO_SEND_THE_NOTIFICATION_TO'], // add more emails to the array if you want
    html: template(pricesObj.curPrice, pricesObj.prevPrice),
  }

  transport.sendMail(options, (err, info) => {
    if (err) {
      console.log(`ERROR sending email: ${err}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}