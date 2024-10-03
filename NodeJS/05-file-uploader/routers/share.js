const router = require('express').Router();
const controller = require('../controllers/shareController');

router.post('/:id',controller.shareFolder);
router.get('/:id',controller.getSharedFolder);


module.exports = router