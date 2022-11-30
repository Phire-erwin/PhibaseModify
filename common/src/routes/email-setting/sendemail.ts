import express, { Request, Response } from 'express';
import { BadRequestError, sendEmail } from '@phibase/common-v2';
const router = express.Router();
import { EmailSetting } from '../../models/emailsetting';
// import { sendEmail } from '../../utils/sendEmail';
import { encrypt, decrypt } from '../../services/cryptoController';

router.post(
  '/api/v1/common/sendEmail/:app',
  async (req: Request, res: Response) => {

    const settingSMTP = await EmailSetting.find({"props.app": req.params.app}).sort({createdAt: -1});
    
    console.log(settingSMTP[0])    
    let source = {
      iv : "",
      content : ""
    }
    source.iv = settingSMTP[0].add
    source.content = settingSMTP[0].password

    let decryptPassword = decrypt(source)

    var SMTPSetting = {
      host: settingSMTP[0].outgoingName,
      port: settingSMTP[0].port,
      name: 'example.com',
      auth: {
        user: settingSMTP[0].email,
        pass: decryptPassword,
      },
    }

    if (!req.body.email) {
        throw new BadRequestError(`There is no Email`);
    }

    try {
      await sendEmail({
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.emailcontent,
        html:req.body.html
      }, SMTPSetting);

      res.status(200).json({ success: true, data: 'Email sent to : '+req.body.name+' (email) : ' +req.body.email });
    } catch (err) {
        console.error(err);
        throw new BadRequestError(`Email could not be sent`);
    }

  }
);

export { router as sendEmailRouter };
