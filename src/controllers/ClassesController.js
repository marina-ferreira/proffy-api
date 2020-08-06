const db = require('../database/connection.js')
const timeConverter = require('../utils/timeConverter.js')

class ClassesController {
  async index(request, response) {
    const filters = request.query
    const isMissingFilters = !filters.subject || !filters.week_day || !filters.time
    const errorMsg = { error: 'Missing filters' }

    if (isMissingFilters) return response.status(400).json(errorMsg)

    const { subject, week_day } = filters
    const time = timeConverter(filters.time)

    const classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [Number(time)])
          .whereRaw('`class_schedule`.`to` > ??', [Number(time)])
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*'])

    return response.json(classes)
  }

  async create(request, response) {
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

      await trx('class_schedule').insert(classSchedulesParams)

      await trx.commit()

      return response.status(201).json()
    } catch(error) {
      console.log(error)
      await trx.rollback()
      return response.status(400).json({ message: 'Error on Class creation' })
    }
  }
}

module.exports = ClassesController
