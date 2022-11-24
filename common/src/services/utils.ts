import * as nodemailer from 'nodemailer';

export class Utils {
  static async convertToUpperCase(array: any) {
    if (array.length === 0) {
      return [];
    }

    var result = array.map((element: string) => {
      return element.toUpperCase();
    })
    return result;
  }

  static async randomString(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static async sendEmail(options: any) {
    if (!process.env.SMTP_HOST) {
      throw new Error('SMTP_HOST must be defined!');
    }
    if (!process.env.SMTP_PORT) {
      throw new Error('SMTP_PORT must be defined!');
    }
    if (!process.env.SMTP_EMAIL) {
      throw new Error('SMTP_EMAIL must be defined!');
    }
    if (!process.env.SMTP_PASSWORD) {
      throw new Error('SMTP_PASSWORD must be defined!');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: `${'No Reply'} <${'noreply@trillium-tech.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
  }
}
