const db = require('../database/connection.js')
const timeConverter = require('../utils/timeConverter.js')

class ConnectionsController {
  async index(request, response) {
    const connections = await db('connections').count('* as total')
    const { total } = connections[0]

    return response.json({ total })
  }

  async create(request, response) {
    const { user_id } = request.body

    await db('connections').insert({ user_id })

    return response.status(201).send()
  }
}

module.exports = ConnectionsController
