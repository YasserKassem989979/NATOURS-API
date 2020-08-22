const Tour = require("../../models/tourModel");
const { sendData, sendError } = require("../../utils/responseHandler");
const ApiFeatures = require("../../utils/apiFeatures");

// all tours
exports.getTours = async (req, res) => {
	try {
		let query = new ApiFeatures(Tour.find(), req.query)
			.filter()
			.sort()
			.pagination()
			.fields();

		const tours = await query.monogoQuery;

		res.status(200).json(sendData("tours", tours));
	} catch (err) {
		res.status(400).json(sendError(err.message));
	}
};

//create tour
exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
		res.status(200).json(sendData("tour", newTour));
	} catch (err) {
		res.status(400).json(sendError(err));
	}
};

//get tour
exports.getTour = async (req, res) => {
	const id = req.params.id;
	try {
		const tour = await Tour.findById(id);
		res.status(200).json(sendData("tour", tour));
	} catch (err) {
		res.status(404).json(sendError("not found!"));
	}
};

// update tour
exports.updateTour = async (req, res) => {
	try {
		const id = req.params.id;
		const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators:true
		});
		res.status(200).json(sendData("tour", updatedTour));
	} catch (err) {
		console.log(err);
		res.status(400).json(sendError("invalid request!"));
	}
};

//delete tour
exports.deleteTour = async (req, res) => {
	try {
		const id = req.params.id;
		await Tour.findByIdAndDelete(id);
		return res.status(200).json(sendData());
	} catch (err) {
		console.log(err);
		res.status(401).json(sendError("err"));
	}
};

exports.validateBodyForCreate = (req, res, next) => {
	if (req.body.name) {
		console.log("Yes");
	} else {
		return res.status(400).json({
			message: "name is required",
		});
	}

	next();
};

exports.fiveCheapestTours = (req, res, next) => {
	req.query.limit = 5;
	req.query.sort = "price";
	next();
};

// get stats for all tours
exports.getToursStats = async (req, res, next) => {
	try {
		let toursStats = await Tour.aggregate([
			{
				$group: {
					_id: null,
					averageRating: { $avg: "$ratingsAverage" },
					averagePrice: { $avg: "$price" },
					minPrice: { $min: "$price" },
					maxPrice: { $max: "$price" },
					count: { $sum: 1 },
				},
			},
		]);
		res.status(200).json(sendData("stats", toursStats));
	} catch (err) {
		res.status(401).json(sendError("err"));
	}
};

// to get which months are full of tours based on year
exports.getBusyMonthsStats = async (req, res, next) => {
	let year = req.params.year;
	let startDate = new Date(`${year}-01-01`);
	let endtDate = new Date(`${year}-12-31`);

	try {
		let tours = await Tour.aggregate([
			{ $unwind: "$startDates" },
			{
				$match: {
					startDates: { $gte: startDate, $lte: endtDate },
				},
			},
			{
				$group: {
					_id: { $month: "$startDates" },
					count: { $sum: 1 },
					tours: { $push: { name: "$name" } },
				},
			},
			{ $addFields: { month: "$_id" } },
			{ $project: { _id: 0 } },
			{ $sort: { count: -1 } },
		]);
		res.status(200).json(sendData("stats", tours));
	} catch (err) {
		console.log(err);
		res.status(401).json(sendError("err"));
	}
};
