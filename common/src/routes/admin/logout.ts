import express from 'express';

const router = express.Router();

router.post('/api/v1/common/auth/admin/logout', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as logoutRouter };
