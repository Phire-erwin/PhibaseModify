import express, { Request, Response } from 'express';
import { NotFoundError } from '@phibase/common-v2';
import { Role } from '../../models/role';

const router = express.Router();

router.get('/api/v1/common/roles/:id', async (req: Request, res: Response) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    throw new NotFoundError();
  }

  res.send(role);
});

export { router as showRoleRouter };