import url from 'url';
import express from 'express';
import AppConfig from '../config/app'
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';


export const GroomerRouter = express.Router();


const groomerService = AppConfig.groomerService;

GroomerRouter.get('', async (req,resp)=>{

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

GroomerRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await groomerService.getGroomerById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

GroomerRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newGroomer = await groomerService.addNewGroomer(req.body);
        return resp.status(201).json(newGroomer);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});
