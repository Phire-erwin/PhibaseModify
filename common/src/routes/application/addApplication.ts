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
  '/api/v1/common/applications/:id',
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
     *  domain:string[],
     *  app:string,
     *  props:object
     * }
     */

    // Check existing application
    const existingReqApplication = await ReqApplication.findById(req.params.id)
    const existingApplication = await Application.find({name:existingReqApplication?.name})

    if (!existingReqApplication) {
      throw new BadRequestError('Request Application is not registered.');
    }
    if(existingApplication.length>0){
      throw new BadRequestError('Application is already registered.');
    }
    
    var application;
    try{
      application= new Application({
        name: existingReqApplication.name,
        "props.id": existingReqApplication.name
      });
      await application.save();
      
    }catch(err){
      console.log(err)
      throw new BadRequestError("error to add application "+err)
    }

    const role = Role.build({
      name: 'Super Admin',
      level: 'Super Admin',
      permission: [
        {
          name: 'Common',
          allAccess: true,
        },
        {
          name: 'Commerce',
          allAccess: true,
        },
        {
          name: 'Manufacture',
          allAccess: true,
        },
        {
          name: 'Quality Control',
          allAccess: true,
        },
        {
          name: 'Distribution',
          allAccess: true,
        },
        {
          name: 'Planner',
          allAccess: true,
        },
      ],
      app: req.body.name
    })
    await role.save();

    var generateEmail = `superadmin@${existingReqApplication.name.replace(/\s+/g, '-').toLowerCase()}.com`;
    var generatePassword = await Utils.randomString(16);
    console.log(generatePassword)

    try {
      // send email
      await Utils.sendEmailAdmin({
          to: existingReqApplication.email,
          email: generateEmail,
          password: generatePassword 
      });
      res.status(200).
      send({
        success: true, 
        data: {
          application: application,
          email: generateEmail,
          password: generatePassword
        }
      });
    } catch (err) {
        console.error(err);
        throw new BadRequestError(`Email could not be sent`);
    }

    const user = User.build({
      email: generateEmail,
      password: generatePassword,
      role: 'Super Admin',
      roleRef: role.id,
      props: {
        app: application.appID,
        firstName: 'Super',
        lastName: 'Admin',
        passwordUpdatedAt: new Date(),
      }
    })
    await user.save();

    // Publisher
    // new UserCreatedPublisher(natsWrapper.client).publish({
    //   id      : user.id,
    //   version : -1,
    //   email   : user.email,
    //   role    : user.role,
    //   props   : user.props,
    // })
    // res.status(200).send({
    //   data: {
    //     application: application,
    //     email: generateEmail,
    //     password: generatePassword
    //   }
    // });
  },
);


export { router as addApplicationRouter};
