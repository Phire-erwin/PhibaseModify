import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../../services/password';
import { Utils } from '../../services/utils';
import { Admin } from '../../models/admin';
import { validateRequest, BadRequestError, NotFoundError } from '@phibase/common-v2';
import { UserLoginPublisher } from '../../events/publishers/user-login-publisher'
import { natsWrapper } from '../../nats-wrapper';
import { Application } from '../../models/application';

const router = express.Router();

router.post(
  '/api/v1/common/auth/admin/login',
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

    // const application= await Application.findOne({appID:app});

    // if(!application){
    //   throw new BadRequestError('Application data not found')
    // }

    const existingAdmin = await Admin.findOne({ email}).populate('roleRef')

    if (!existingAdmin) {
      throw new NotFoundError();
    }

    const passwordsMatch = await Password.compare(
      existingAdmin.password,
      password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Password');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id      : existingAdmin.id,
        email   : existingAdmin.email,
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
        existingAdmin
      });
  },
);

export { router as loginRouter };

