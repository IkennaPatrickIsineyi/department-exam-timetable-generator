//exam.app.js
//import router
const router = require("./routers/exam.router.js");
//import express,dotevn,cookie-parser
const express = require("express");
const cors = require('cors');

require("dotenv/config");

const cookieParser = require("cookie-parser");
const path = require("path");
//const setupDatabase = require("./controllers/hms.controllers.js").setupDatabase;
//const setupDatabase = require("./controllers/hms.sqlite.controllers.js").setupDatabase;
const fileUpload = require("express-fileupload");
//set public folder
const dir = path.join(__dirname, '..', 'time-table-app', 'build');


//get Port value
const PORT = process.env.PORT;

//initialise express app
const app = express();
//set cookies parser middleware
app.use(cookieParser());
//set middleware for files
app.use(fileUpload());
//set middleware for static file
app.use(express.static(dir));
//set urlencoded middleware
app.use(express.urlencoded({ extended: true }));
//set json middleware
app.use(express.json());
app.use(cors(
	{
		origin: true,
		credentials: true
	}
));
//set routes for router
app.use("/api", router.router);

app.get('/*', function (req, res) {
	const index = path.join(__dirname, '..', 'time-table-app', 'build', 'index.html')
	console.log(index);
	res.sendFile(index);
})


//launch app and listen
const launchServer = () => {
	app.listen(PORT, (error) => {
		if (error) console.log("ERROR launching server", error);
		else console.log("Server launched on port " + PORT);
	});
}


router.setup(launchServer);
