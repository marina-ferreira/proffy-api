const knex = require('knex')

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'databse.sqlite')
  },
  useNullAsDefault: true
})

export default db
