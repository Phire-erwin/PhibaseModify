import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Application } from '../../models/application';
import { RequestValidationError, BadRequestError,propUpdate} from '@phibase/common-v2';

const router = express.Router();

router.put(
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
      throw new BadRequestError("The Application with "+req.params.id+" does not found")
    }

    if(application===null){
      throw new BadRequestError("application is null")
    }
    // Update application
    var newProp= propUpdate(application.props,req.body.props);
    req.body.props=newProp;
    try {
      application = await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new:true,
          runValidators:true
        }
      );
      


      if(application===null){
        throw new BadRequestError("application is null")
      }
      await application.save();

      //publish application through nats publisher
      var idApplication=(application.id)?application.id.toString():application._id.toString();
      
      // Update time
      application.updatedAt = new Date();
      await application.save();
    } catch (err) {
      throw new BadRequestError("failed application update")
    }



    res.status(200).send({data:application});
  },
);

export { router as updateApplicationRouter };
