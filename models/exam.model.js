//model/exam.model.js
//import connection
const sql = require('./exam.db.js');

//create tables//
//create usertb
exports.createUsertb = (result) => {
    sql.run("create table if not exists usertb(\
     username varchar(15) primary key, password varchar(30),\
      position varchar(10), level varchar(3))", result);
}

//create coursetb
exports.createCoursetb = (result) => {
    sql.run("create table if not exists coursetb(\
     courseCode varchar(10) primary key, title varchar(40),\
      level varchar(3), population integer, semester varchar(5))", result);
}

/* //create timetabletb
exports.createTimetabletb = (result) => {
    sql.run("create table if not exists timetabletb(\
     examId integer primary key, courseCode varchar(10),\
      examDate date not null, examTime time not null, \
      level varchar(3), semester varchar(3) not null,\
      session varchar(10),hoursPerPeriod float,foreign key \
     (courseCode) references coursetb(courseCode) \
     on delete cascade on update cascade, foreign key \
    (session) references sessiontb(session) on delete \
    cascade on update cascade)", result);
} */

//create timetabletb
exports.createTimetabletb = (result) => {
    sql.run("create table if not exists timetabletb(\
     examId integer primary key,timetable text, session varchar(100), semester varchar(30))", result);
}

//create sessiontb
exports.createSessiontb = (result) => {
    sql.run("create table if not exists sessiontb(\
     session varchar(10) primary key, startTime time not null,\
      startDate date not null, endDate date not null,\
      breakPerPaper int not null, papersPerDay int not null)", result);
}



//create logintb
exports.createLogintb = (result) => {
    sql.run("create table if not exists logintb(\
     sessionId varchar(64) primary key, username varchar(15),\
      dateLogged date default(current_date), timeLogged \
      time default(current_time), foreign key(username) \
      references usertb(username) on delete \
      cascade on update cascade)", result);
}

//create triggers(if any)//

//queries//
//createAdmin
exports.createAdmin = (result) => {
    sql.run("insert or ignore into usertb(username,\
    password, position) values (?,?,?)", ['admin', 'admin', 'admin'],
        result);
}

//createAccount
exports.createAccount = (username, password, level, position, result) => {
    sql.run("insert into usertb(username,\
    password, position,level) values (?,?,?,?)",
        [username, password, position, level], result);
}

//checkLoginStatus:username,sessionId,result(err,res)
exports.checkLoginStatus = (staffId, sessionId, result) => {
    sql.all("select * from logintb where username=?\
    and sessionId=?", [staffId, sessionId], result);
};

//login
exports.login = (username, password, sessionId, result) => {
    sql.run("insert into logintb(username,\
    sessionId) select ?,? where exists \
   (select username from  usertb where username=? \
   and password=?)", [username, sessionId, username,
        password], result);
}

//logout
exports.logout = (sessionId, result) => {
    sql.run("delete from logintb where sessionId= ?", [sessionId],
        result);
}

//addCourses
exports.addCourses = (courses, result) => {
    let values = [];
    console.log('courses ', courses);
    const placeholder = courses.map((item) => {
        values.push(...[item.courseCode, item.title, item.level, item.population, item.semester]);
        return `(?,?,?,?,?)`;
    }).join(',');

    console.log('values', values);

    console.log('placeholder', placeholder);

    sql.run("insert or replace into coursetb(courseCode,title,level,population,semester)\
    values "+ placeholder, values, result);
}

//addTimetable
exports.addTimetable1 = (courses, session, startTime,
    startDate, endDate, breakPerPaper, periodsPerDay, hoursPerPeriod, result) => {
    let values = [];
    const placeholder = courses.map((item) => {
        values.push(...[item.courseCode, item.examDate,
        item.examTime, item.session, item.semester, item.level]);
        return `(?,?,?,?,?,?)`;
    }).join(',');

    console.log('values', values);

    console.log('placeholder', placeholder);

    sql.run("insert into coursetb(courseCode,examDate,\
    examTime,session,semester,level)values "+ placeholder, values,
        function (err, res) {
            if (err) {
                result(err);
            }
            else {
                sql.run("insert into sessiontb(session,startTime,\
          startDate,endDate,breakPerPaper,periodsPerDay,hoursPerPeriod) \
           values (?,?,?,?,?,?)", [session, startTime, startDate,
                    endDate, breakPerPaper, periodsPerDay, hoursPerPeriod], result);
            }
        });
}

//createAdmin
exports.addTimetable = (timetable, session, semester, result) => {
    sql.run("insert or replace into timetabletb(timetable,\
        session, semester) values (?,?,?)", [timetable, session, semester],
        result);
}

//deleteCourses
exports.deleteCourse = (course, result) => {
    sql.run("delete from coursetb where courseCode = ?",
        course, result);
}

//updateCourses
exports.updateCourses = (courses, result) => {
    //courses=[[courseCode,title,level,courseCode],...]
    let count = 0;
    const updater = (courseCode) => {
        sql.run("update coursetb set population=? \
        where courseCode=?", [courses[courseCode], courseCode], function (err, res) {
            count++;
            if (err) {
                console.log("error updating coursetb", err);
                if (count === Object.keys(courses).length) {
                    console.log("finished");
                    result(err, this);
                }
            }
            else {
                console.log("record updated", this);
                if (count === Object.keys(courses).length) {
                    console.log("finished");
                    result(err, this);
                }
            }
        });
    };

    for (let courseCode of Object.keys(courses)) {
        updater(courseCode);
    }
}

//updateTimetable
exports.updateTimetable = (courses, result) => {
    //courses=[[examDate,examTime,examId,courseCode],...]
    let count = 0;
    const updater = (course) => {
        sql.run("update coursetb set examDate=?,\
    examTime=? where examId=? and courseCode=?", course, function (err, res) {
            count++;
            if (err) {
                console.log("error updating timetabletb", err);
                if (count === courses.length) {
                    result(err, this);
                }
            }
            else {
                console.log("record updated", this);
                if (count === courses.length) {
                    result(err, this);
                }
            }
        });
    };

    for (let course of courses) {
        updater(course);
    }
}

//getAllTimetable
exports.getAllTimetable = (result) => {
    sql.all("select t.session,t.semester,s.startTime, \
   s.startDate, s.endDate,s.breakPerPaper,s.periodsPerDay, \
  t.courseCode,t.examDate, t.examTime,\
   t.level from timetabletb as t inner join sessiontb \
   as s on t.session=s.session", result);
}

//getLevelTimetable
exports.getLevelTimetable = (session, level, result) => {
    sql.all("select t.session,s.startTime,s.startDate,\
   s.endDate,s.breakPerPaper,s.periodsPerDay, \
   t.courseCode,t.examDate, t.examTime,\
   from timetabletb as t inner join sessiontb as s on \
   t.session=s.session where \
   session=? and level=?", [session, level], result);
}

//getAdminHome
exports.getAdminHome = (username, result) => {
    sql.all("select t.session\
   from timetabletb as t inner join sessiontb as s on \
   t.session=s.session where \
   session=? and level=?", [session, level], result);
}

//getUsers
exports.getUsers = (result) => {
    sql.all("select username from usertb", result);
}

//getTimeTable
exports.getTimeTable = (session, semester, result) => {
    sql.all("select timetable,session,semester from timetabletb\
     where session=? and semester=?", [session, semester], result);
}

//getSemesters
exports.getSemesters = (result) => {
    sql.all("select distinct session,semester from timetabletb", result);
}


//getUserType
exports.getUserType = (username, result) => {
    sql.all("select position from usertb where username=?", [username], result);
}

//getCourses
exports.getCourses = (result) => {
    sql.all("select courseCode,title,level,population,semester from coursetb", result);
}

//getSemesterCourses
exports.getSemesterCourses = (semester, result) => {
    sql.all("select courseCode,title,level,population,semester\
     from coursetb where semester=?", [semester], result);
}