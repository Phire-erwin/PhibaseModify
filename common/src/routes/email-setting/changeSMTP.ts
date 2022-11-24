import express, { Request, Response } from 'express';
import { BadRequestError, sendEmail } from '@phibase/common-v2';
import { EmailSetting } from '../../models/emailsetting';
import { Password } from '../../services/password';
import { encrypt, decrypt } from '../../services/cryptoController';

const router = express.Router();

router.post(
  '/api/v1/common/settingSMTP',
  async (req: Request, res: Response) => {
    const existingSMTP = await EmailSetting.find({ "props.app": req.body.props.app })
    
    if(existingSMTP.length>0){
      let source = {
        iv : "",
        content : ""
      }
      source.iv = existingSMTP[0].add
      source.content = existingSMTP[0].password
      const text = decrypt(source);

      if(req.body.previousPassword !== text){
        throw new BadRequestError('Invalid Previous Password.');
      }
    }
    
    var emailSetting;
    try{
        emailSetting = new EmailSetting(req.body)
        await emailSetting.save()
        if(existingSMTP.length>0){
          await existingSMTP[0].remove()
        }
    }catch(err){
        console.log(err)
        throw new BadRequestError("Error to Change SMTP "+err)
    }
    res.status(200).send({data:emailSetting});
  }
);

export { router as settingSMTPRouter };
