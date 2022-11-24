import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Application } from '../../models/application';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';

const router = express.Router();

router.delete(
  '/api/v1/common/applications/:id',
  [
    
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    var application;
    try {
      application = await Application.findById(req.params.id);
    } catch (err) {
      throw new BadRequestError("Error getting application "+req.params.id)
    }
    if(!application){
      console.error("Application is not found")
      throw new BadRequestError("Application is not found")
    }

    // Delete transaction
    try {
      await application.remove();

    } catch (err) {
      throw new BadRequestError("ERROR: "+err)
    
    }

  res.status(200).send({data:{}});
  },
);

export { router as deleteApplicationRouter };
