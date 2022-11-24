import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { validateRequest, BadRequestError } from '@phibase/common-v2';

const router = express.Router();

router.put(
  '/api/v1/common/auth/reset-password/:resetToken',
  [
    body('newPassword')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { newPassword } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    // Find existing user
    const existingUser = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!existingUser) {
      throw new BadRequestError(`Invalid token.`);
    }

    existingUser.set({
      password            : newPassword,
      resetPasswordToken  : undefined,
      resetPasswordExpire : undefined,
      updatedAt           : new Date()
    })
    await existingUser.save();

    res.status(200).send(existingUser);
  },
);

export { router as resetPasswordRouter };
