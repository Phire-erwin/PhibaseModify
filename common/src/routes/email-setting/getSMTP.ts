import express, { Request, Response } from 'express';
import { BadRequestError, sendEmail } from '@phibase/common-v2';
import { EmailSetting } from '../../models/emailsetting';
import { Password } from '../../services/password';

const router = express.Router();

router.get(
  '/api/v1/common/settingSMTP/:app',
  async (req: Request, res: Response) => {
    const settingSMTP = await EmailSetting.find({"props.app": req.params.app}).sort({createdAt: -1});
    res.send(settingSMTP[0]);
  }
);

export { router as settingSMTPRouter };
