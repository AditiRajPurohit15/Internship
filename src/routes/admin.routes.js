const express = require('express')
const {getUsersController} = require('../controllers/admin.controller')
const authMiddleware = require('../middlewares/auth.middlewares')
const roleMiddleware = require('../middlewares/role.middlewares')
const router = express.Router();

router.get('/getusers', authMiddleware, roleMiddleware(['Admin']), getUsersController);

module.exports = router
