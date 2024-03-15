const express = require('express')
const router = express.Router()
// const usersController = require('../controllers/usersController')

router
	.route('/')
	.get()
	.post()
	.patch()
	.delete()

module.exports = router
