import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Password } from '../../services/password';
import { User } from '../../models/user';
import { validateRequest, BadRequestError } from '@phibase/common-v2';

const router = express.Router();

router.put(
  '/api/v1/common/auth/update-password',
  [
    body('email')
      .isEmail().withMessage('Email must be valid'),
    body('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
    body('newPassword')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      currentPassword,
      newPassword
    } = req.body;

    // Find existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError(`Email ${email} is not registered.`);
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      currentPassword,
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Password is incorrect');
    }

    existingUser.set({
      password  : newPassword,
      updatedAt : new Date()
    })
    await existingUser.save();

    res.status(200).send(existingUser);
  },
);

export { router as updatePasswordRouter };
