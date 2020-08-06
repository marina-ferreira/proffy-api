const express = require('express')

const db = require('../database/connection.js')
const timeConverter = require('../utils/timeConverter.js')

const routes = express.Router()

routes.post('/classes', async (request, response) => {
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = request.body

  const trx = await db.transaction()

  try {
    const userIds = await trx('users').insert({
      name,
      avatar,
      whatsapp,
      bio,
    })

    const classIds = await trx('classes').insert({
      subject,
      cost,
      user_id: userIds[0]
    })

    const classSchedulesParams = schedule.map(item => ({
      week_day: item.week_day,
      from: timeConverter(item.from),
      to: timeConverter(item.to),
      class_id: classIds[0]
    }))

    const classSchedules = await trx('class_schedule').insert(classSchedulesParams)

    await trx.commit()

    return response.status(201).json()
  } catch(error) {
    console.log(error)
    await trx.rollback()
    return response.status(400).json({ message: 'Error on Class creation' })
  }
})

module.exports = routes
