const dotenv = require("dotenv");
dotenv.config({ path: "./utils/config.env" });
const app = require("./app");
const mongoose = require("mongoose");

//connect to db
let db_host = process.env.DB_PROD;
if (process.env.NODE_ENV == "dev") db_host = process.env.DB_DEV;
mongoose.connect(db_host, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("db connected");
});
// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, "127.0.0.1", () => {
	console.log(`listening to port ${PORT}`);
});
