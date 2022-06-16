const defaultHtml = require('./templates/default');
const dotenv = require('dotenv').config();

const createEmailHtmlDefault = (content, subject) => {
    let emailHtml = defaultHtml.replace('{{SUBJECT}}', subject);
    emailHtml = emailHtml.replace('{{CONTENT}}', content);
    return emailHtml;
}

module.exports = { createEmailHtmlDefault};
