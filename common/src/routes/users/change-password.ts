import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { Password } from '../../services/password';
import { validateRequest, NotFoundError, BadRequestError } from '@phibase/common-v2';

const router = express.Router();

router.put(
  '/api/v1/common/auth/change-password/:id',
  [
    body('currentPassword').trim().isLength({ min: 6, max: 20}).withMessage('Current Password must be between 12 and 20 characters'),
    body('newPassword').trim().isLength({ min: 12, max: 20}).withMessage('New Password must be between 12 and 20 characters'),
    body('confirmPassword').trim().isLength({ min: 12, max: 20}).withMessage('Confirm Password must be between 12 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    // Find existing user
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      throw new NotFoundError();
    }

    // Compare Password
    const passwordsMatch = await Password.compare(
      existingUser.password,
      currentPassword,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials.');
    }

    // Confirm Password
    if (newPassword !== confirmPassword) {
      throw new BadRequestError(`Confirm Password does not match.`)
    }

    existingUser.set({
      password: newPassword,
      props: {
        ...existingUser.props,
        passwordUpdatedAt: new Date(),
      },
      updatedAt : new Date()
    })
    await existingUser.save();

    res.status(200).send(existingUser);
  },
);

export { router as changePasswordUserRouter };