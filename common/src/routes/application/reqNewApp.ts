import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Utils } from '../../services/utils';

import { Application } from '../../models/application';
import { Role } from '../../models/role';
import { User } from '../../models/user';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';

import { UserCreatedPublisher } from '../../events/publishers/user-created-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { ReqApplication } from '../../models/requestApplication';

const router = express.Router();

router.post(
  '/api/v1/common/request-application',
  [
    
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    /**
     * req body expected
     * {
     *  name:string,
     *  email:string
     * }
     */

    // Check existing application
    // const existingApplication = await Application.find({
    //     name: req.body.name,
    // })
    const existingReqApplication = await ReqApplication.find({
        name: req.body.name,
    })

    if (existingReqApplication.length > 0) {
      throw new BadRequestError('Application is already requested.');
    }

    try{
      var requestapplication= new ReqApplication(req.body);
      await requestapplication.save();
      
    }catch(err){
      console.log(err)
      throw new BadRequestError("error to req application "+err)
    }
    // Publisher
    // new UserCreatedPublisher(natsWrapper.client).publish({
    //   id      : user.id,
    //   version : -1,
    //   email   : user.email,
    //   role    : user.role,
    //   props   : user.props,
    // })
    res.status(200).send({
      data: {
        requestApplication: requestapplication
      }
    });
  },
);

export { router as reqApplicationRouter };
