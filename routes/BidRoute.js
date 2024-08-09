const router = require("express").Router()
const bidCtrl = require('../controllers/bidCtrl');
const auth = require("../middlewares/auth");

router.get('/getAll' ,bidCtrl.getAll)
router.post('/join' , bidCtrl.join);
// router.post('/participate' , bidCtrl.participate);
router.post('/mise',auth , bidCtrl.mise)

module.exports = router
