import express from 'express';
import { currentUser } from '@phibase/common-v2';

const router = express.Router();

router.get('/api/v1/common/auth/current-user', currentUser, (req, res) => {
  res.send({ ...req.currentUser || null });
});

export { router as currentUserRouter };