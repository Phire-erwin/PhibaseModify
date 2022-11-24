import express from 'express';

const router = express.Router();

router.post('/api/v1/common/auth/logout', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as logoutRouter };
