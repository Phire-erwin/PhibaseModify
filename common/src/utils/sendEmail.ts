// Dependencies
import * as nodemailer from 'nodemailer'; 

const sendEmail = async (options:any, SMTPSetting:any) => {
  const transporter = nodemailer.createTransport({
    host: SMTPSetting.host ,
    port: SMTPSetting.port,
    name: SMTPSetting.name,
    auth: SMTPSetting.auth
  });

  const message = {
    from: `${'PIP Support'} <${'noreply@trillium-tech.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export { sendEmail };
