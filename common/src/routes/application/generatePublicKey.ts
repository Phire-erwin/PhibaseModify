import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Application } from '../../models/application';
import { RequestValidationError, BadRequestError,propUpdate } from '@phibase/common-v2';
import { Key } from '../../services/key'
const router = express.Router();

router.put(
  '/api/v1/common/applications/generate/:id',
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
      throw new BadRequestError("The Application with "+req.params.id+" does not found")
    }

    if(application===null){
      throw new BadRequestError("application is null")
    }
    // Update application
    var application;
    var publicKey= await Key.generatePublic(application.props.privateKey);
    
    /**
     * application.props.publicKey=
     *  (application.props.publicKey==undefined)?[]:application.props.publicKey;
     *  application.props.publicKey.push(publicKey);
     * 
     * */
    
    try {
      application.updatedAt = new Date();
      await application.save();
      console.log('generate application key ',application)
    } catch (err) {
      throw new BadRequestError("failed application update")
    }

    res.status(200).send({data:publicKey});

  },
);

export { router as generatePublicKeyRouter };
