import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../../services/password';
import { Utils } from '../../services/utils';
import { validateRequest, BadRequestError, NotFoundError } from '@phibase/common-v2';
import { UserLoginPublisher } from '../../events/publishers/user-login-publisher'
import { natsWrapper } from '../../nats-wrapper';
import { Application } from '../../models/application';
import { User } from "../../models/user";

const router = express.Router();

router.post(
  '/api/v1/common/auth/loginadmin',
  [
    body('email')
      .notEmpty()
      .isEmail().withMessage('Invalid Email'),
    body('password')
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage('You must supply a password.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password
    } = req.body;

    const existingUser = await User.findOne({ email }).populate('roleRef')

    if (!existingUser) {
      throw new NotFoundError();
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Password');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id      : existingUser.id,
        email   : existingUser.email,
        role    : existingUser.role,
      },
      'secret',
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    // Publisher
    // new AdminLoginPublisher(natsWrapper.client).publish({
    //   id      : existingUser.id,
    //   version : -1,
    //   email   : existingUser.email,
    //   role    : existingUser.role,
    //   props   : existingUser.props,
    // })

    res.status(200)
      .send({
        token: userJwt,
        existingUser,
      });
  },
);

export { router as loginRouter };

