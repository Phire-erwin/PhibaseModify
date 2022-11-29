import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Application } from '../../models/application';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';
import { mongoQuery } from '@phibase/common-v2';
import { ReqApplication } from '../../models/requestApplication';

const router = express.Router();

router.get(
    '/api/v1/common/request-application',
    mongoQuery,
    [
        
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        
        var applications;
        
        try{
        applications = await ReqApplication.find(req.mongoQuery)  
        }catch(err){
        throw new BadRequestError("ERROR: "+err)
        }
        
        res.status(200).send({data:applications});
    },
);

export { router as getApplicationsRouter };
