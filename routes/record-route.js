const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const recordsController = require('../controllers/record-controller');

router.get('/records', authenticate, recordsController.getRecords);
router.get('/records/:recordId', authenticate, recordsController.getRecordById);
// router.post('/records', authenticate, recordsController.createRecord);

module.exports = router;
