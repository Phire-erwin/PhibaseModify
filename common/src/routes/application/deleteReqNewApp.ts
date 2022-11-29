import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Application } from '../../models/application';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';
import { ReqApplication } from '../../models/requestApplication';
import { Utils } from '../../services/utils';

const router = express.Router();

router.delete(
    '/api/v1/common/request-applications/:id',
    [
        
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        

        if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
        }
        var existingReqApplication;
        try {
        existingReqApplication = await ReqApplication.findById(req.params.id);
        } catch (err) {
        throw new BadRequestError("Error getting application "+req.params.id)
        }
        if(!existingReqApplication){
        console.error("Application is not found")
        throw new BadRequestError("Application is not found")
        }
        try {
            await Utils.sendEmailAdminReject({
                to: existingReqApplication.email,
            });
            await existingReqApplication.remove();
            res.status(200).
            send({ 
                success: true,
                message: 'Data has been reject and delete'});
        } catch (err) {
            console.error(err);
            throw new BadRequestError(`Email could not be sent. `+"\nERROR: "+err);
        }

    res.status(200).send({data:{}});
    },
);

export { router as deleteReqApplicationRouter };
