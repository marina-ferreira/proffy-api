const express = require('express')

const ClassesController = require('../controllers/ClassesController')

const routes = express.Router()

const classesController = new ClassesController()

routes.post('/classes', classesController.create)
routes.get('/classes', classesController.index)

module.exports = routes
