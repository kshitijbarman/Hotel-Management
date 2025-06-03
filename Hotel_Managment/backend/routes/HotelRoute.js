const express = require('express');
const router = express.Router();
const HotelController = require('../controller/HotelController');
 
router.get('/cities/:cityId/hotels', HotelController.getHotelsByCity);
 
router.post('/hotels/add', HotelController.addHotel);

 
router.put('/hotels/:id', HotelController.updateHotel);
 
router.delete('/hotels/:id', HotelController.deleteHotel);
 
router.patch('/hotels/:id/softdelete', HotelController.softDeleteHotel);

 
router.patch('/hotels/:id/activate', HotelController.activateHotel);


router.get("/hotels", HotelController.getAllHotels); 

module.exports = router;
