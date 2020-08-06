const db = require('../database/connection.js')
const timeConverter = require('../utils/timeConverter.js')

class ConnectionsController {
  async create(request, response) {
    const { user_id } = request.body

    await db('connections').insert({ user_id })

    return response.status(201).send()
  }
}

module.exports = ConnectionsController
