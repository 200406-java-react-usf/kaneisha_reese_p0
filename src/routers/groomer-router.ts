import url from 'url';
import express from 'express';
import AppConfig from '../config/app'
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const GroomerRouter = express.Router();


const groomerService = AppConfig.groomerService;

GroomerRouter.get('', adminGuard, async (req,resp)=>{

    try {
        let reqURL = url.parse(req.url, true);

        if (!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await groomerService.getGroomerByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await groomerService.getAllGroomers();
            resp.status(200).json(payload);
        }
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});