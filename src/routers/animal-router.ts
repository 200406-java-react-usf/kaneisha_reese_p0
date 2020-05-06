import url from 'url';
import express from 'express';
import AppConfig from '../config/app'
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';


export const AnimalRouter = express.Router();


const AnimalService = AppConfig.animalService;

AnimalRouter.get('', async (req,resp)=>{

    
    let reqURL = url.parse(req.url, true);
        
     try{
        let payload = await AnimalService.getAllAnimals();
        resp.status(200).json(payload);
        
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

AnimalRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await AnimalService.getAnimalById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

AnimalRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /animals');
    console.log(req.body);
    try {
        let newAnimal = await AnimalService.addNewAnimal(req.body);
        return resp.status(201).json(newAnimal);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

AnimalRouter.put('', async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /animals');
    console.log(req.body);
    try {
        let updatedAnimal = await AnimalService.updateAnimal(req.body);
        return resp.status(201).json(updatedAnimal).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});

AnimalRouter.delete('/:id', async (req,resp)=>{
    const id = +req.params.id;
    try {
        let payload = await AnimalService.deleteById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});