const express = require("express");
const router = express.Router();
const RoomController = require("../controller/RoomController");

router.get("/:hotelId/rooms", RoomController.getRoomsByHotel);
// router.get('/hotels/:hotelId/rooms', RoomController.getRoomsByHotel);
router.get("/rooms/:id", RoomController.getRooms);
router.post("/rooms/add", RoomController.addRoom);
router.put("/rooms/:id", RoomController.updateRoom);
router.delete("/rooms/:id", RoomController.deleteRoom);
router.patch("/rooms/:id/softdelete", RoomController.softDeleteRoom);
router.patch("/rooms/:id/activate", RoomController.activateRoom);
router.post("/rooms/upload-images", RoomController.uploadRoomImages);

module.exports = router;