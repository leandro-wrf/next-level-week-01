import { Router } from 'express'

import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'

const routes = Router()

routes.get('/items', ItemController.index)

routes.get('/points', PointController.index)
routes.post('/point', PointController.create)
routes.get('/point/:id', PointController.show)

export default routes
