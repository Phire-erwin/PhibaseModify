import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { NotFoundError, BadRequestError,propUpdate } from '@phibase/common-v2';
import { UserUpdatedPublisher } from '../../events/publishers/user-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import {generateSecret,generateToken} from 'node-2fa'

const router = express.Router();

router.post(
  '/api/v1/common/generate/2fa/:id',
  async (req: Request, res: Response) => {

    // Find existing user
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      throw new NotFoundError();
    }

    const newSecret = generateSecret({name:existingUser.props.app,account:existingUser.email});

    const token= generateToken(newSecret.secret);

    var newProps=propUpdate(existingUser.props,{secret2fa:newSecret.secret,activated2FA:true})
    var newUserData= await User.findByIdAndUpdate(req.params.id,{props:newProps},{new:true});
    res.status(200).send({secret:newSecret,currentToken:token,newUserData:newUserData});
  },
);

export { router as generate2FARouter };
