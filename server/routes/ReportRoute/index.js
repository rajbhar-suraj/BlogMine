const express = require('express')
const { middleWare } = require('../../controllers/userController')
const {submitReport} = require('../../controllers/reportController')

const router = express.Router()

router.post('/report',middleWare, submitReport)

module.exports = router