const nodemailer = require('nodemailer');
const { readFileSync } = require('fs');
const { join } = require('path');
const {
  MAILER_USER: user,
  MAILER_SENDER_NAME: name,
  MAILER_CLIENT_ID: clientId,
  MAILER_CLIENT_SECRET: clientSecret,
  MAILER_REFRESH_TOKEN: refreshToken,
  MAILER_ACCESS_TOKEN: accessToken,
} = require('../../env');

const style = readFileSync(join(__dirname, 'mail.css')).toString();

const createHtml = (title, body) => `
<html lang="ko">
<head>
  <title>[${name}] ${title}</title>
  <style>${style}</style>
</head>
<body>
  <h1>${name}</h1>
  <h2>${title}</h2>
  <div class="container">${body}</div>
</body>
</html>`;

const sendMail = async (subject, body, to) => {
  const transport = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { type: 'OAuth2', user, clientId, clientSecret, refreshToken, accessToken, expires: 3600 }
  });
  const html = createHtml(subject, body);
  const options = { from: `${name} <${user}>`, to, subject: `[${name}] ${subject}`, html };
  await transport.sendMail(options);
  transport.close();
};

exports.sendMail = sendMail;
