import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Application } from '../../models/application';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';
import { Key } from '../../services/key';


const router = express.Router();

router.get(
  '/api/v1/common/applications/:id',
  [
    
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    var application;
    var accessData={status:200,message:'No Access Required'};
    try {
      application = await Application.findById(req.params.id);
      
      var userKey=req.query.userKey?.toString();
      if(application?.props.keyRequired){
        if(!userKey){
          accessData={
            status:404,message:'Public key is required'
          }
        }else{
          var result=await Key.checkAccess(userKey,application.props.privateKey);
          accessData=(result)?{
            status:200,message:'Access Granted'
          }:{
            status:401,message:'Access Denied'
          }
        }
        
      }
    } catch (err) {
      throw new BadRequestError("The Category with "+req.params.id+" does not found")
    }


    
    res.status(200).send({data:application,access:accessData});
  },
);

export { router as getApplicationRouter };
