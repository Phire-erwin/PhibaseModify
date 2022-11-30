import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../../services/password';
import { Utils } from '../../services/utils';
import { User } from '../../models/user';
import { validateRequest, BadRequestError, NotFoundError } from '@phibase/common-v2';
import { UserLoginPublisher } from '../../events/publishers/user-login-publisher'
import { natsWrapper } from '../../nats-wrapper';
import { Application } from '../../models/application';
import { Admin } from '../../models/admin';

const router = express.Router();

router.post(
  '/api/v1/common/auth/login',
  [
    body('email')
      .notEmpty()
      .isEmail().withMessage('Email must be valid.'),
    body('password')
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage('You must supply a password.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      app
    } = req.body;
    
    const application= await Application.findOne({appID:app});
    if(!application){
      throw new BadRequestError('Application data not found')
    }

    const existingUser = await User.findOne({ email, "props.app":app}).populate('roleRef')
    if (!existingUser) {
      throw new NotFoundError();
    }
    
    const passwordsMatch: boolean = await Password.compare(
      existingUser.password,
      password
    );
    
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials.');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id      : existingUser.id,
        email   : existingUser.email,
        role    : existingUser.role,
        props   : existingUser.props
      },
      'secret',
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    // Publisher
    // new UserLoginPublisher(natsWrapper.client).publish({
    //   id      : existingUser.id,
    //   version : -1,
    //   email   : existingUser.email,
    //   role    : existingUser.role,
    //   props   : existingUser.props,
    // });
    // console.log(UserLoginPublisher)

    res.status(200)
      .send({
        token: userJwt,
        existingUser
      });
  },
);

export { router as loginRouter };

