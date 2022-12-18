//routers/exam.router.js
//import controllers
const controllers = require('../controllers/exam.controller.js');
//import router from express
const router = require('express').Router();

//define setup router
const setup = (callback) => {
	controllers.setup(callback);
}
//define routers//

//createAccount
router.post('/createAccount', controllers.createAccount);
//login
router.post('/login', controllers.login);
//logout
router.get('/logout', controllers.logout);
//entry
router.get('/entry', controllers.entryPoint);
//getSemesters
router.get('/getSemesters', controllers.getSemesters);
//addCourses
router.post('/addCourses', controllers.addCourses);
//addTimetable
router.post('/addTimetable', controllers.addTimetable);
//deleteCourses
router.post('/deleteCourses', controllers.deleteCourses);
//updateCourses
router.post('/updateCourses', controllers.updateCourses);
//updateTimetable
router.post('/updateTimetable', controllers.updateTimetable);
//getAllTimetables
router.post('/getAllTimetables', controllers.getAllTimetables);
//getLevelTimetable
router.post('/getLevelTimetable', controllers.getLevelTimetable);
//getLevelTimetable
router.post('/getTimeTable', controllers.getTimeTable);
//getUsers
router.get('/getUsers', controllers.getUsers);
//getCourses
router.get('/getCourses', controllers.getCourses);
//getSemesterCourses
router.get('/getSemesterCourses', controllers.getSemesterCourses);
//entryPoint
router.get('/*', controllers.entryPoint);

module.exports = { router, setup }