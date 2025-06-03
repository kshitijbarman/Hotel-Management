const express = require('express');
const router = express.Router();
const CityController = require('../controller/CityController');

 
router.get('/states/:stateId/cities', CityController.getCitiesByState);

 
router.post('/cities/add', CityController.addCity);

 
router.put('/cities/:id', CityController.updateCity);

 
router.delete('/cities/:id', CityController.deleteCity);

 
router.patch('/cities/:id/softdelete', CityController.softDeleteCity);

 
router.patch('/cities/:id/activate', CityController.activateCity);

module.exports = router;
