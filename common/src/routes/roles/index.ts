import express, { Request, Response } from 'express';
import { Role } from '../../models/role';

const router = express.Router();

router.get('/api/v1/common/roles', async (req: Request, res: Response) => {
  const roles = await Role.find().sort({name: 1, level: 1});

  res.send(roles);
});

export { router as indexRoleRouter };