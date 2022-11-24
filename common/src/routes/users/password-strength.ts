import express, { Request, Response } from 'express';
import { passwordStrength } from '@phibase/common-v2';

const router = express.Router();

router.post('/api/v1/common/password-strength',
  async (req: Request, res: Response) => {
  const { strength, characters, entropy } = passwordStrength(req.body.password);

  res.send({
    strength,
    characters,
    entropy
  });
});

export { router as passwordStrengthRouter };
