const { default: mongoose } = require('mongoose');
const City = require('../model/CityModel');
const Hotel = require("../model/HotelModel");

exports.getCitiesByState = async (req, res) => {
  try {
     const cities = await City.find({ state: req.params.stateId }).populate("state");

  //   const cities = await City.find({ state: req.params.stateId }).aggregate([
    
  //     {
  //       $lookup: {
  //         from: "states",
  //         localField: "state",
  //         foreignField: "_id",
  //         as: "state"
  //       }
  //     },
       
  //   ]);
    res.json(cities);
  } catch (err) {
    console.error("GET /api/states/:stateId/cities - Error:", err);
    res.status(500).json({ message: "Failed to fetch cities" });
  } 

  // try {
  //   const { stateId } = req.params;

    
  //   const cities = await City.aggregate([
     
  //     {
  //       $lookup: {
  //         from: "states",
  //         localField: "state",
  //         foreignField: "_id",
  //         as: "state"
  //       }
  //     },
     
  //   ]);

     

  //   res.json(cities);
  // } catch (err) {
  //   console.error("GET /api/states/:stateId/cities - Error:", err);
  //   res.status(500).json({ message: "Failed to fetch cities", error: err.message });
  // }
};

exports.addCity = async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    const populatedCity = await City.findById(city._id).populate("state");
    res.json(populatedCity);
  } catch (err) {
    console.error("POST /api/cities/add - Error:", err);
    res.status(400).json({ message: err.message || "Failed to add city" });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("state");
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json(city);
  } catch (err) {
    console.error("PUT /api/cities/:id - Error:", err);
    res.status(400).json({ message: err.message || "Failed to update city" });
  }
};

exports.deleteCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) return res.status(404).json({ message: "City not found" });
        await Hotel.deleteMany({ city: req.params.id });  
        await city.deleteOne();
        res.json({ message: "City and associated hotels deleted" });
      } catch (err) {
        console.error("DELETE /api/cities/:id - Error:", err);
        res.status(500).json({ message: "Failed to delete city" });
      }
};

exports.softDeleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json({ message: "City deactivated" });
  } catch (err) {
    console.error("PATCH /api/cities/:id/softdelete - Error:", err);
    res.status(500).json({ message: "Failed to deactivate city" });
  }
};

exports.activateCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json({ message: "City activated" });
  } catch (err) {
    console.error("PATCH /api/cities/:id/activate - Error:", err);
    res.status(500).json({ message: "Failed to activate city" });
  }
};
