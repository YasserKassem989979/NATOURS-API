const express = require("express");
const router = express.Router();
const tourController = require("../../controllers/tourController");


// get busiest months
router.route("/busyMonths/:year").get(tourController.getBusyMonthsStats);

// get stats about tours
router.route("/toursStats").get(tourController.getToursStats);

// top 5 cheap tours
router
	.route("/fivecheapesttours")
	.get(tourController.fiveCheapestTours, tourController.getTours);

//get all tours and create tour
router
	.route("/")
	.get(tourController.getTours)
	.post(tourController.validateBodyForCreate, tourController.createTour);

// RUD tour
router
	.route("/:id")
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = router;
