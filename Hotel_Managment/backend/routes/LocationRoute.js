const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const locationController = require('../controller/LocationController');

router.post('/add', locationController.createLocation);
// get all active locations
router.get('/all', locationController.getAllLocations);

// get one location by id
router.get('/:id', locationController.getOneLocation);

// update location by id
router.put('/:id', locationController.updateLocation);

// delete location permanently by id
router.delete('/:id', locationController.deleteLocation);

// soft delete location by id
router.patch('/:id/softdelete', locationController.softDeleteLocation);
router.patch('/:id/activate', locationController.ActivateLocation);

module.exports = router;
