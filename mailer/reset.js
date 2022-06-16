//const mailer = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const mailer = require('@sendgrid/mail');
const { resetHtml, resetText, resetSubject } = require('./html/Reset');

const resetEmail = async ({ email: to, user_id, first_name }) => {
    let host = ''
    jwt.sign(
        { user_id, first_name, email:to, type: 'verify' },
        process.env.TOKEN_SECRET,
        async (err, token) => {
            if (err) throw err;
            if(process.env.NODE_ENV === "development"){
              host = "http://localhost:3000"
            }else if(process.env.NODE_ENV === "staging"){
              host = "https://staging.waterpin.com"
            }else{
              host = "https://waterpin.com"
            }

            const msg = {
                to,
                from: {email: process.env.FROM_EMAIL, name: 'Waterpin'},
                subject: 'Waterpin | Password Reset',
                text: `${host}/auth/reset/${token}`,
                html: resetHtml({ button_link: `${host}/auth/reset/${token}`, button_text: 'Reset Password' })
            };

            await mailer.send(msg);

        }
    );
};

module.exports = { resetEmail };
