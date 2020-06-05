import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate';

import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'

const routes = Router()
const upload = multer(multerConfig)

routes.get('/items', ItemController.index)

routes.get('/points', PointController.index)
routes.get('/point/:id', PointController.show)

routes.post('/point', upload.single('image'), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    whatsapp: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    city: Joi.string().required(),
    uf: Joi.string().required().max(2),
    items: Joi.string().required()
  })
}, {
  abortEarly: false
}), PointController.create)

export default routes
