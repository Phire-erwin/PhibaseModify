import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { NotFoundError, BadRequestError } from '@phibase/common-v2';
import { UserUpdatedPublisher } from '../../events/publishers/user-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import {verifyToken} from 'node-2fa'


const router = express.Router();

router.post(
  '/api/v1/common/validate/2fa/:id',
  async (req: Request, res: Response) => {
    const {
      code2fa
    } = req.body;

    if (!code2fa) {
      throw new BadRequestError(`2FA code is required`);
    }

    // Find existing user
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      throw new NotFoundError();
    }

    var secret2fa= existingUser.props.secret2fa;

    if (!secret2fa){
      throw new BadRequestError(`secret 2FA in user data not found`);
    }

    var verifyData= verifyToken(secret2fa,code2fa);

    console.info('secret '+secret2fa+" code: "+code2fa+" ",verifyData);

    if (verifyData==null){
      throw new BadRequestError(`Token given is error`);
    }

    if (verifyData.delta!=0){
      throw new BadRequestError(`Token given is too late/too early`);
    }
    res.status(200).send(verifyData);
  },
);

export { router as validate2FARouter };
