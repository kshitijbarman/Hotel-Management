 
const express = require('express');
const router = express.Router();
const stateController = require('../controller/StateController');

 
router.get('/states', stateController.getAllStates);

 
router.post('/states/add', stateController.addState);
 
router.put('/states/:id', stateController.updateState);

 
router.delete('/states/:id', stateController.deleteState);

 
router.patch('/states/:id/softdelete', stateController.softDeleteState);
 
router.patch('/states/:id/activate', stateController.activateState);

module.exports = router;
