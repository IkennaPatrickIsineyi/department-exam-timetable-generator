//controllers/exam.controller.js
//import model
const db = require('../models/exam.model.js');
const crypto = require("crypto");
const path = require('path');

const genSessionId = () => {
    return crypto.randomBytes(32).toString('base64');
};

//setup
exports.setup = (callback) => {
    const tasks = [db.createUsertb, db.createCoursetb, db.createTimetabletb,
    db.createSessiontb, db.createLogintb, db.createAdmin];

    const numOfTasks = tasks.length;
    let count = 0;

    const result = function (err, res) {
        count++
        if (err) {
            console.log("error creating table...", err);
            if (count === numOfTasks) {
                console.log("Setup COMPLETE...");
                callback();
            }
        }
        else {
            console.log("setup task " + count + " ran successfully...", res);
            if (count === numOfTasks) {
                console.log("Setup COMPLETE...");
                callback();
            }
        }
    }

    for (let task of tasks) {

        task(result);
    }
}

//checkLoginStatus
const checkLoginStatus = (username, sessionId, result) => {
    console.log('sessionId :', sessionId);
    console.log('username :', username);
    db.checkLoginStatus(username, sessionId, function (err, res) {
        if (err) {
            console.log("Error checking login status...", err);
            result(null, err);
        }
        else if (res.length > 0) {
            console.log("already logged in...", res);
            result(true, null);
        }
        else {
            console.log("not logged in...", res);
            result(false, null);
        }
    });
};

//entryPoint
exports.entryPoint = (req, res) => {
    const username = req.cookies.username;
    console.log('called');
    checkLoginStatus(username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                //homePageSetup(username, req, res, () => { });
                res.send({ respCode: 1 })// show homepage 
                /*  const index = path.join(__dirname, 'examApp', 'build', 'index.html')
                 console.log(index);
                 res.sendFile(index); */
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 2 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//createAccount
exports.createAccount = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === false) {
                db.createAccount(req.body.username, req.body.password,
                    req.body.level, 'student', function (err) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0 });
                        }//if(err)
                        else if (this.changes) {
                            console.log("account created...", req.body.username);
                            res.send({ respCode: 1 });
                        }//else if(this.changes)
                        else {
                            console.log("user already exists...", result);
                            res.send({ respCode: 2 });
                        }
                    }
                );//db.createAccount
            }//else if (isLoggedIn===false)
            else if (isLoggedIn === true) {
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===true)
        });//checkLoginStatus
};

const admin = (username, req, res, callback) => {
    /*  db.getAllTimetable(username, (err, result) => {
         if (err) {
             res.send({ respCode: 0 });
         }
         else {
             callback();
             res.send({ respCode: 1, user: 'admin', data: result });
         }
     }); */
    callback();
    res.send({ respCode: 1, user: 'admin', data: ['result will be here'] });
}

const student = (username, req, res, callback) => {
    db.getSemesters(function (err, result) {
        if (err) {
            console.log('error occured ', err);
            res.send({ respCode: 0 });
        }
        else {
            console.log('sessions and semesters ', result);
            callback();
            res.send({ respCode: 1, user: 'student', data: result });
        }
    });
    /*  callback();
     res.send({ respCode: 1, user: 'student', data: ['result will be here'] }); */
}

const finishLogin = (username, sessionId, req, res) => {
    db.getUserType(username, function (err, result) {
        if (err) {
            res.send({ respCode: 0 });
        }
        else {
            const users = { 'admin': admin, 'student': student };
            console.log('usertype ', result[0].position, Object.keys(users))
            if (result[0].position in users) {
                console.log('usertype found ')
                users[result[0].position](username, req, res, () => {
                    res.cookie("username", username/* , { sameSite: 'none', secure: true } */);
                    res.cookie("sessionId", sessionId/* , { sameSite: 'none', secure: true } */);
                });
            } else {
                console.log('usertype not found ')
                res.send({ respCode: 0 });
            }
        }
    });
}

//login
exports.login = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === false) {
                const sessionId = genSessionId();
                console.log(req.body.username, req.body.password);
                db.login(req.body.username, req.body.password, sessionId,
                    function (err, result) {
                        if (err) {
                            console.log("Error occurred...", err, sessionId);
                            res.send({ respCode: 0 });
                        }//if
                        else if (this.changes) {
                            console.log("log in successful...", this);
                            /*  res.cookie("username", req.body.username , { sameSite: 'none', secure: true } );
                             res.cookie("sessionId", sessionId , { sameSite: 'none', secure: true } ); */
                            finishLogin(req.body.username, sessionId, req, res);
                        }//else if(this.changes)
                        else {
                            console.log("Invalid credentials...", this);
                            res.send({ respCode: 2 });
                        }
                    });//db.login
            }//else if (isLoggedIn===false)
            else if (isLoggedIn === true) {
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===true)
        });//checkLoginStatus
}

//logout
exports.logout = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                db.logout(req.cookies.sessionId,
                    function (err, result) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0 });
                        }//if
                        else {
                            console.log("logged out...", result);
                            res.clearCookie("username");
                            res.clearCookie("sessionId");
                            res.send({ respCode: 1 });
                        }//else 
                    });//db.login
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.clearCookie("username");
                res.clearCookie("sessionId");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//addCourses
exports.addCourses = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                const courses = JSON.parse(req.body.courses);
                let newCourses = []
                console.log('courses: ', courses);
                Object.values(courses).map(item => newCourses.push(...item));
                console.log('newCourses', newCourses);
                db.addCourses(newCourses,
                    function (err) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0 });
                        }//if
                        else if (this.changes) {
                            console.log("courses added...", this);
                            res.send({ respCode: 1 });
                        }//else if(this.changes)
                        else {
                            console.log("Something is wrong somewhere...", this);
                            res.send({ respCode: 2 });
                        }
                    });//db.login
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//addTimetable
exports.addTimetable1 = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                const timeTable = JSON.parse(req.body.timeTable);
                console.log('timeTable: ', timeTable);
                db.addCourses(timeTable, req.body.session,
                    req.body.startTime, req.body.startDate, req.body.endDate,
                    req.body.breakPerPaper, req.body.periodsPerDay,
                    req.body.hoursPerPeriod, function (err) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0 });
                        }//if
                        else if (this.changes) {
                            console.log("timetable added...", this);
                            db.getAllTimetables((err, result) => {
                                if (err) {
                                    console.log("error in getAllTimetables...", err);
                                    res.send({ respCode: 0 });
                                }
                                else {
                                    console.log("All time tables retrieved...", result);
                                    res.send({ respCode: 1, data: result });
                                }
                            });
                        }//else if(this.changes)
                        else {
                            console.log("Something is wrong somewhere...", this);
                            res.send({ respCode: 2 });
                        }
                    });//db.login
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};


//addTimetable
exports.addTimetable = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                //const timeTable = JSON.parse(req.body.timeTable);
                console.log('timeTable: ', req.body.timeTable);
                db.addTimetable(req.body.timeTable, req.body.session,
                    req.body.semester, function (err) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0 });
                        }//if
                        else if (this.changes) {
                            console.log("timetable added...", this);
                            res.send({ respCode: 1 })
                        }//else if(this.changes)
                        else {
                            console.log("Something is wrong somewhere...", this);
                            res.send({ respCode: 2 });
                        }
                    });//db.login
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//deleteCourses
exports.deleteCourses = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                // const courses = JSON.parse(req.body.courses);
                const courses = req.body.courseCode;
                console.log('courses: ', courses);
                db.deleteCourse(courses,
                    function (err) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0 });
                        }//if
                        else if (this.changes) {
                            console.log("courses deleted...", this);
                            //res.send({ respCode: 1 });
                            db.getCourses(function (err, result) {
                                if (err) {
                                    console.log("Error occurred...", err);
                                    res.send({ respCode: 0, data: [] });
                                }//if
                                else {
                                    console.log("...", result);
                                    res.send({ respCode: 1, data: result });
                                }
                            });
                        }//else if(this.changes)
                        else {
                            console.log("Something is wrong somewhere...", this);
                            res.send({ respCode: 2 });
                        }
                    });//db.login
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//updateCourses
exports.updateCourses = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                const courses = JSON.parse(req.body.newValues);
                console.log('courses: ', courses);
                if (!Object.keys(courses).length)
                    res.send({ respCode: 1 });
                else
                    db.updateCourses(courses,
                        function (err, result) {
                            if (err) {
                                console.log("Error occurred...", err);
                                res.send({ respCode: 0 });
                            }//if
                            else if (result.changes) {
                                console.log("courses updated...", result);
                                res.send({ respCode: 1 });
                            }//else if(this.changes)
                            else {
                                console.log("Something is wrong somewhere...", result);
                                res.send({ respCode: 2 });
                            }
                        });//db.login
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//updateTimetable
exports.updateTimetable = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                const courses = JSON.parse(req.body.courses);
                console.log('courses: ', courses);
                db.addCourses(courses,
                    function (err) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0 });
                        }//if
                        else if (this.changes) {
                            console.log("timetable updated...", this);
                            res.send({ respCode: 1 });
                        }//else if(this.changes)
                        else {
                            console.log("Something is wrong somewhere...", this);
                            res.send({ respCode: 2 });
                        }
                    });//db.login
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//getAllTimetables
exports.getAllTimetables = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                db.getAllTimetables(function (err, result) {
                    if (err) {
                        console.log("Error occurred...", err);
                        res.send({ respCode: 0, data: [] });
                    }//if
                    else {
                        console.log("all timetables retrieved...", result);
                        res.send({ respCode: 1, data: result });
                    }
                });//db.getMyAppointments
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//getLevelTimetable
exports.getLevelTimetable = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                db.getLevelTimetable(req.body.session, req.body.level,
                    function (err, result) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0, data: [] });
                        }//if
                        else {
                            console.log("level timetable retrieved", result);
                            res.send({ respCode: 1, data: result });
                        }
                    });//db.getMyAppointments
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//getTimeTable
exports.getTimeTable = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                db.getTimeTable(req.body.session, req.body.semester,
                    function (err, result) {
                        if (err) {
                            console.log("Error occurred...", err);
                            res.send({ respCode: 0, data: [] });
                        }//if
                        else {
                            console.log("sesion-semester timetable retrieved", result);
                            res.send({ respCode: 1, data: result });
                        }
                    });//db.getMyAppointments
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};
//getUsers
exports.getUsers = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                db.getUsers(function (err, result) {
                    if (err) {
                        console.log("Error occurred...", err);
                        res.send({ respCode: 0, data: [] });
                    }//if
                    else {
                        console.log("all users retrieved", result);
                        res.send({ respCode: 1, data: result });
                    }
                });//db.getMyAppointments
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//getCourses
exports.getCourses = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                db.getCourses(function (err, result) {
                    if (err) {
                        console.log("Error occurred...", err);
                        res.send({ respCode: 0, data: [] });
                    }//if
                    else {
                        console.log("...", result);
                        res.send({ respCode: 1, data: result });
                    }
                });//db.getMyAppointments
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//getSemesterCourses
exports.getSemesterCourses = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                console.log("req.query.semester...", req.query.semester);
                db.getSemesterCourses(req.query.semester, function (err, result) {
                    if (err) {
                        console.log("Error occurred...", err);
                        res.send({ respCode: 0, data: [] });
                    }//if
                    else {
                        console.log("...", result);
                        res.send({ respCode: 1, data: result });
                    }
                });//db.getMyAppointments
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};

//getSemesters
exports.getSemesters = (req, res) => {
    checkLoginStatus(req.cookies.username, req.cookies.sessionId,
        (isLoggedIn, error) => {
            if (error) {
                res.send({ respCode: 0 });
            }//if(error)
            else if (isLoggedIn === true) {
                db.getSemesters(function (err, result) {
                    if (err) {
                        console.log("Error occurred...", err);
                        res.send({ respCode: 0, data: [] });
                    }//if
                    else {
                        console.log("retrieved", result);
                        res.send({ respCode: 1, data: result });
                    }
                });//db.getMyAppointments
            }//else if (isLoggedIn===true)
            else if (isLoggedIn === false) {
                console.log("not logged in...");
                res.send({ respCode: 3 });
            }//else if(isLoggedIn===false)
        });//checkLoginStatus
};
