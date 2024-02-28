const router = require("express").Router()
const bidCtrl = require('../controllers/bidCtrl')


router.post('/join' , bidCtrl.join);

module.exports = router
