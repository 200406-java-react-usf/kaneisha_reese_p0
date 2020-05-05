import url from 'url';
import express from 'express';
import AppConfig from '../config/app'
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';


export const ServiceRouter = express.Router();


const serviceService = AppConfig.serviceService;

ServiceRouter.get('', async (req,resp)=>{

    try {
        let payload = await serviceService.getAllServices();
        resp.status(200).json(payload);
        
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

ServiceRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await serviceService.getServiceById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ServiceRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /Services');
    console.log(req.body);
    try {
        let newService = await serviceService.addNewService(req.body);
        return resp.status(201).json(newService);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

ServiceRouter.put('', async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /Services');
    console.log(req.body);
    try {
        let updatedService = await serviceService.updateService(req.body);
        return resp.status(201).json(updatedService).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});

ServiceRouter.delete('/:id', async (req,resp)=>{
    const id = +req.params.id;
    try {
        let payload = await serviceService.deleteById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});