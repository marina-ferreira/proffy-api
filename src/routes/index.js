const express = require('express')

const ClassesController = require('../controllers/ClassesController')

const routes = express.Router()

const classesController = new ClassesController()

routes.post('/classes', classesController.create)

module.exports = routes
