import { Request, Response } from 'express'
import connection from '../database/connection'

class PointController {
  async index(request: Request, response: Response): Promise<Response> {
    const { city, uf, items } = request.query

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()))

    const points = await connection('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

      const serializedPoints = points.map(point => {
        return {
          ...points,
          image_url: `http://localhost:192.178.31.105:3333/uploads/${point.image}`
        }
      })

    return response.json(serializedPoints)
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const point  = await connection('points').where('id', id).first()

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' })
    }

    const serializedPoints = {
      ...point,
      image_url: `http://localhost:192.178.31.105:3333/uploads/${point.image}`
    }

    const items = await connection('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('title')

    return response.json({ 
      point: serializedPoints,
      items
    })
  }

  async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body

    const trx = await connection.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }

    let id

    try {

      const insertIds = await trx('points').insert(point)

      const point_id = insertIds[0]

      const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
          return {
            item_id,
            point_id
          }
      })

      await trx('point_items').insert(pointItems)
      id = point_id

      await trx.commit();
    } catch (error) {
      return response.json({ message: error})
    }

    return response.json({
      id,
      ...point
    })
  }
}

export default new PointController()
