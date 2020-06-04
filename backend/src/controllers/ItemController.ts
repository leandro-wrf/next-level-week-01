import { Request, Response } from 'express'
import connection from '../database/connection'

class ItemController {
  async index(request: Request, response: Response): Promise<Response> {
    const data = await connection('items').select('*')

    const serializedItems = data.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.178.31.105:3333/uploads/${item.image}`
      }
    })

    return response.json(serializedItems)
  }
}

export default new ItemController()
