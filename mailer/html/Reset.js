const { createEmailHtmlDefault } = require('../utils');

const resetText = 'Reset Your Password';

const resetSubject = 'Waterpin | Password Reset Request';

const resetContent = data => {
    const { button_link, button_text } = data;

    return `
    <tr>

    </tr>
    `
}

const resetHtml = data => {
    const content = resetContent(data);

    return createEmailHtmlDefault(content, resetSubject);
}

module.exports = { resetText, resetHtml, resetSubject };
