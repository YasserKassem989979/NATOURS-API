const express = require("express");
const chalk = require("chalk");
const log = (text) => console.log(chalk.bgRed(text));
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const ErrorHandler = require("./utils/errorHandler");
//app
const app = express();

// MIDDLE WARES
if (process.env.NODE_ENV === "dev") {
	app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//ROUTING

//tour router
app.use("/api/v1/tours", tourRouter);
//user router
app.use("/api/v1/users", userRouter);

// 404 handler
app.all("*", (req, res, next) => {
	next(new ErrorHandler("Not Found!", 404));
});

//Error handler
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "error";
	res.status(err.statusCode).json({
		message: err.message,
	});
});

module.exports = app;
