const router = require("express").Router()
const bidCtrl = require('../controllers/bidCtrl');
const auth = require("../middlewares/auth");

router.get('/getAll' , auth,bidCtrl.getAll)
router.post('/join' , bidCtrl.join);
router.post('/participate' , bidCtrl.participate);
router.post('/mise', bidCtrl.mise)

module.exports = router
