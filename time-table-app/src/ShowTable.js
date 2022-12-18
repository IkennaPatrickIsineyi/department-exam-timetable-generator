import { useEffect, useState } from "react";
import { Card, Col, Container, Button, Row, Table, Modal, ModalBody, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { sharedVariables } from "./sharedVariables";
const passport = 'passport.jpg';

function ShowTable(props) {
    const [allTimeTable, setTimeTable] = useState({});
    const [showBanner, setBanner] = useState(0);

    const [level1Course, setLevel1Course] = useState([]);
    const [level2Course, setLevel2Course] = useState([]);
    const [level3Course, setLevel3Course] = useState([]);
    const [level4Course, setLevel4Course] = useState([]);

    const [matrix, setMatrix] = useState([]);

    const [level1Table, setLevel1Table] = useState([]);
    const [level2Table, setLevel2Table] = useState([]);
    const [level3Table, setLevel3Table] = useState([]);
    const [level4Table, setLevel4Table] = useState([]);


    //  const [examTimes, setExamTimes] = useState([]);
    //   const [examDates, setExamDates] = useState([]);

    let examTimes = [];
    let examDates = [];


    const allLevels = ['100', '200', '300', '400'];

    const locations = useLocation();
    const navigate = useNavigate();

    const bannerText = ["", "Account created", "Something went wrong...try again",
        "You are not logged in... Login"];
    const alertColors = ["danger", "success", "warning", "secondary"];

    const [showModal, setShowModal] = useState(false);
    const [blockView, setBlockView] = useState(false);

    const url = sharedVariables.url;

    const courses = locations.state.courses;
    const startDate = locations.state.startDate;
    const endDate = locations.state.endDate;
    const periodsPerDay = Number(locations.state.periodsPerDay);
    const startTime = locations.state.startTime;
    const hoursPerPeriod = Number(locations.state.hoursPerPeriod);
    const breakPerPeriod = Number(locations.state.breakPerPeriod);
    const examHalls = locations.state.halls;
    const semester = locations.state.semester;
    const session = locations.state.session;

    console.log('delivered values', {
        periodsPerDay: periodsPerDay,
        startDate: startDate, endDate: endDate, startTime: startTime,
        breakPerPeriod: breakPerPeriod, hoursPerPeriod: hoursPerPeriod
    });

    console.log('values of course statesetters ', level1Course,
        level2Course, level3Course, level4Course);
    // const data = props.reqItems;

    //const data = locations.state.reqItems;

    const setCourse1 = (value) => {
        setLevel1Course(value);
    }
    const setCourse2 = (value) => {
        setLevel2Course(value);
    }
    const setCourse3 = (value) => {
        setLevel3Course(value);
    }
    const setCourse4 = (value) => {
        setLevel4Course(value);
    }

    const sortCourses = (courses, courseStateObj, level, stateValue) => {
        console.log(courses, level);
        console.log('filtered courses', courses.filter((course) => course[2] === level))
        const newArr = courses.filter((course) => course[2] === level);
        console.log('newarr', newArr);
        courseStateObj([...newArr]);

        console.log('stateValue', stateValue)
    }

    for (let level of ['100', '200', '300', '400']) {
        const stateObjArr = [setCourse1, setCourse2,
            setCourse3, setCourse4];
        const stateValue = [level1Course, level2Course,
            level3Course, level4Course];

        const indx = ['100', '200', '300', '400'].indexOf(level);
        console.log('stateValue[indx]', stateValue[indx]);
        if (!((stateValue[indx]).length))
            sortCourses(courses, stateObjArr[indx], level, stateValue[indx]);
    }


    const tableObjectBuilder = (timetb, levelIndx) => {
        const examDates = timetb.examDates;
        const examTimes = timetb.examTimes;
        const rowCount = examDates.length;
        const colCount = examTimes.length;
        const prod = rowCount * colCount;
        const examDatesArr = [...Array(rowCount).keys()];
        const examTimesArr = [...Array(colCount).keys()];
        let count = 0;
        const matrix = timetb.matrix;
        const levelTimetable = timetb[allLevels[levelIndx]]


        console.log('tableObjectBuilder');
        console.log('timetb', timetb);
        console.log('levelTimetable ', levelTimetable);
        console.log('matrix ', matrix);
        // console.log('matrix[1]', matrix[1]);
        /* console.log('cell[1]', Object.values(timetb).filter((cell) => {
            console.log('inner cell[0]', cell[0]);
            return cell[0] === matrix[1]
        })); */



        // let tmpCell = [];

        const genCell = (value) => {
            const tmpCell = Object.values(levelTimetable).filter((cell) => cell[0] === matrix[value]);
            // console.log('tmpCell', tmpCell);
            ++count;
            let venueName = [];
            // console.log('cell value', (tmpCell.length) ? tmpCell : null);
            //console.log('cell hall', (tmpCell.length) ? tmpCell[0][2][0] : null);
            if (tmpCell.length) {


                const datatype = typeof tmpCell[0][2][0];
                console.log('venue1', datatype, tmpCell[0][2]);
                venueName = (datatype === 'object') ? tmpCell[0][2].map(item => {
                    console.log('venue2', item);
                    return item[0]
                }
                ) : tmpCell[0][2][0]
                console.log('venue3', venueName);
            }

            return (tmpCell.length) ? tmpCell[0][1][0] + ' (' + venueName + ')' : null
        }

        return <Table bordered striped responsive>
            <thead>
                <tr>
                    <th className="bg-light">
                        Dates
                    </th>
                    {examTimes.map((item) =>
                        <th className="bg-light">
                            {item}
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {examDatesArr.map((item) =>
                    <tr>
                        <td className="bg-light">
                            {examDates[item]}
                        </td>
                        {examTimesArr.map((obj) =>
                            <td id={matrix[count]} className="bg-dark text-light ">
                                {genCell(count)}
                            </td>
                        )}
                    </tr>
                )}
            </tbody>
        </Table>
        // console.log('tableObjectBuilder finished', levelIndx);
    };


    const tableArrayBuilder = (/*courses, tableStateObj,  levelIndx */) => {

        /* 
        input formats: 
        const courses=['cA','cB','cC','cD','cE'];
        const startDate='2022-11-10';
        const endDate='2022-12-4';
        const startTime='08:00';
        const breakPerPeriod='30';
        const periodsPerDay=4; */

        const numOfCourses = courses.length;
        // console.log('courses 1', courses);
        const numOfDays = Math.ceil((new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24)) + 1;
        console.log(numOfDays);
        const days1 = [...Array(numOfDays).keys()];
        // console.log(days1);
        let days = [...days1];
        let table = [];
        let tableMatrix = [];
        let timeTable = [];

        const to12HrForm = (time) => {
            const hour = time.substring(0, 2);
            const minute = time.slice(2);
            // console.log('hour,minute', hour, minute);
            const chng = hour % 12
            return (chng == 0) ? '12' + minute : chng + minute
        }

        const genTime = (multiplier) => {
            //time is in minutes
            //breakPerPeriod is in minutes
            const tmpStartTime = new Date(startDate)
            tmpStartTime.setHours(startTime.slice(0, 2));
            const addedMinutes = (multiplier * Number(hoursPerPeriod) * 60) + (multiplier * breakPerPeriod);
            tmpStartTime.setMinutes(
                tmpStartTime.getMinutes() + addedMinutes);
            //console.log(tmpStartTime.toLocaleTimeString());
            const time1 = tmpStartTime.toLocaleTimeString().slice(0, 8);
            tmpStartTime.setMinutes(tmpStartTime.getMinutes() + (hoursPerPeriod * 60));
            const time2 = tmpStartTime.toLocaleTimeString().slice(0, 8);
            //return to12HrForm(time1) + ' - ' + to12HrForm(time2);
            return time1 + ' - ' + time2;
        }

        const validTimes = [...Array(periodsPerDay).keys()].map((item) => {
            return genTime(item);
        });

        //setExamTimes(validTimes);
        console.log('validTimes', validTimes);

        examTimes = validTimes;

        const genDay1 = (dayNum) => {
            //const dayNum=pickRandomElement(days);
            const dayDate = new Date(startDate)
            dayDate.setDate(dayDate.getDate() + dayNum);

            const valu = (dayDate.getDay() === 0) ?
                null : dayDate.toDateString();
            days.splice(days.indexOf(dayNum), 1);
            console.log('dt', valu)

            return valu;
        }

        const allDates = [...Array(numOfDays).keys()].map((item) => genDay1(item));
        const allDates2 = allDates.filter((item) => item !== null);

        //setExamDates(allDates);

        examDates = allDates2;

        const pickRandomElement = (arr) => {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        const genDay = () => {
            const dayNum = pickRandomElement(days);
            const dayDate = new Date(startDate)
            dayDate.setDate(dayDate.getDate() + dayNum);

            const valu = (dayDate.getDay() === 0) ?
                genDay() : dayDate.toDateString();
            days.splice(days.indexOf(dayNum), 1);
            console.log('dt', valu)

            return valu;
        }


        for (let date of allDates2) {
            for (let time of validTimes) {
                tableMatrix.push(date + '  ' + time);
            }
        }

        console.log('tmatrix', tableMatrix);
        console.log('courses', courses);

        console.log('timeTable', timeTable);

        let levelTimeTables = {};

        const coursesForTable = {
            '100': level1Course, '200': level2Course,
            '300': level3Course, '400': level4Course,
        }


        const examVenues = [['200LT', 200], ['500LT', 500], ['1000LT', 1000]];
        /* 
                const genTable = (level, courses, venues, initialVenues,
                    matrix, dateTime, levels) => {
        
                    if (Object.values(courses).filter(item => item.length === 0)[0])
                        return 1
        
                    let deadEnd = false;
                    let chosenCourse = [];
                    let chosenVenueList = [];
                    let chosenVenue = [];
                    let sortedVenueList = [];
                    let newMatrix = [];
                    let newCourses = [];
                    let newVenues = [];
                    if (venues.length === initialVenues.length) {
                        dateTime = pickRandomElement(matrix);
                        console.log('dateTime ', dateTime);
                    }
                    chosenCourse = courses[level][0]
                    chosenVenueList = venues.filter(hall => hall[1] >= chosenCourse[2]);
                    let prevHallArr = [];
                    let prevHallValue = 0;
        
                    if (!chosenVenueList) {
                        chosenVenueList = venues.filter((hall) => {
                            prevHallValue = hall[1];
                            prevHallArr = hall;
                            return (hall[1] + prevHallValue) >= chosenCourse[2];
                        });
                        if (!chosenVenueList) {
                            deadEnd = true;
                            return genTable(level, courses, [...initialVenues], initialVenues,
                                matrix, dateTime, levels);
                        }
                        else {
                            sortedVenueList = chosenVenueList.sort((a, b) => a[1] - b[1]);
                            chosenVenue = sortedVenueList[0];
                            if (venues.length === initialVenues.length)
                                newMatrix = [...matrix].splice(matrix.indexOf(dateTime), 1);
                            else newMatrix = [...matrix];
                            const { level: _, ...tmpCourses } = courses;
                            newCourses = { ...tmpCourses, ...[...courses[level]].splice(courses.indexOf(chosenCourse), 1) };
                            newVenues = [...venues].splice(venues.indexOf(chosenVenue));
                            levelTimeTables[level] = (levelTimeTables[level]) ? [...levelTimeTables[level], [dateTime, chosenCourse, chosenVenue]]
                                : [[dateTime, chosenCourse, chosenVenue]];
        
                            if ((levels.indexOf(level) + 1 >= levels.length) || !newVenues.length)
                                return genTable(levels[0], newCourses, [...initialVenues], initialVenues,
                                    newMatrix, dateTime, levels);
                            else return genTable(levels[levels.indexOf(level) + 1], newCourses, newVenues, initialVenues,
                                newMatrix, dateTime, levels);
                        }
                    }
                } */


        const genTable = (level, courses, venues, initialVenues,
            matrix, dateTime, levels) => {

            const genVen = (startIndx, target, currSum, currIndx, arr) => {
                console.log('currSum', currSum);
                console.log('target', target);
                console.log('currIndx', currIndx);
                console.log('arr', arr);
                console.log('arr[currIndx]', arr[currIndx]);
                if (currIndx >= arr.length) {
                    console.log('currIndx>=arr.length');
                    return [0];
                }
                if (arr[currIndx][1] + currSum >= target) {
                    console.log('arr[currIndx][1]+currSum>=target');
                    return [1, arr[currIndx], startIndx, currIndx];
                }
                else {
                    console.log('else');
                    return genVen(startIndx, target, currSum + arr[currIndx][1], currIndx + 1, arr);
                }
            }

            console.log('allCourses ', courses);
            console.log('continue?  ', Boolean(Object.values(courses).filter(item => {
                console.log('available item', item[0]);
                return !Boolean(item[0]) === false
            })[0]));

            console.log('courses key ', Boolean(Object.values(courses)[levels.indexOf(level)].length))
            //if(Object.values(courses).filter(item=>item.length===0)[0])
            if (Boolean(Object.values(courses).filter(item => !Boolean(item[0]) === false)[0])) {
                /*   if (!Boolean(Object.values(courses)[levels.indexOf(level)].length)) return genTable(levels[0], JSON.parse(JSON.stringify(courses)),
                      [...venues], [...initialVenues], [...matrix], dateTime, [...levels]);
   */

                if (Object.values(courses)[levels.indexOf(level)][0] == undefined)
                    return genTable((levels.indexOf(level) + 1 >= levels.length) ?
                        levels[0] : levels[levels.indexOf(level) + 1],
                        JSON.parse(JSON.stringify(courses)), [...venues], [...initialVenues],
                        matrix, dateTime, levels);


                let deadEnd = false;
                let chosenCourse = [];
                let chosenVenueList = [];
                let chosenVenue = [];
                let sortedVenueList = [];
                let newMatrix = [];
                let newCourses = [];
                let newVenues = [];

                if (venues.length === initialVenues.length) {
                    dateTime = pickRandomElement(matrix);
                    console.log('dateTime ', dateTime);
                }
                console.log('matrix ', matrix);
                console.log('level ', level);
                // chosenCourse = [...courses[level]].sort((a, b) => a[3] - b[3])[0];
                //let tmpchosenCourse = [...courses[level]];
                console.log('courses[level] ', courses[level]);
                chosenCourse = courses[level].sort((a, b) => a[3] - b[3])[0];
                console.log('chosenCourse test ', courses[level].sort((a, b) => a[3] - b[3])[0]);
                console.log('chosenCourse ', chosenCourse);
                chosenVenueList = venues.filter(hall => hall[1] >= chosenCourse[3]);
                console.log('chosenVenueList ', chosenVenueList);
                let prevHallArr = [];
                let prevHallValue = 0;
                let hallIndex = 0;
                let prevHallIndex = 0;

                let totalCapacity = 0;
                initialVenues.map(item => totalCapacity += item[1]);
                console.log('totalCapacity', totalCapacity);

                if (totalCapacity < chosenCourse[3]) {
                    console.log('capacity exceeded');
                    chosenVenueList = [['null', null]]

                }

                console.log('chosenVenBool', Boolean(chosenVenueList.length));
                if (!chosenVenueList.length) {
                    chosenVenueList = venues.filter((hall) => {
                        prevHallValue = hall[1];
                        prevHallArr = [...hall];
                        prevHallIndex += hallIndex;
                        hallIndex++;
                        return (hall[1] + prevHallValue) >= chosenCourse[3] && hall[0] != prevHallArr[0];
                    });


                    if (!chosenVenueList.length) {
                        const found = genVen(0, chosenCourse[3], 0, 0, venues);
                        if (!found[0]) {
                            console.log('dead end ');
                            deadEnd = true;
                            return genTable(level, JSON.parse(JSON.stringify(courses)), [...initialVenues], initialVenues,
                                matrix, dateTime, levels);
                        }//if
                        else {
                            newVenues = [...venues];
                            const fullIndex = found[2] + found[3] + 1;
                            chosenVenue = [...venues.slice(found[2], found[3] + 1)];
                            for (let item of [...Array(fullIndex).keys()]) {
                                newVenues.splice(venues.indexOf(item), 1);
                            }//for

                        }//else
                    }//if
                    else {

                        //  console.log('inner chosenVenueList',    chosenVenueList[0], prevHallArr[0]);
                        //  chosenVenue=[[...chosenVenueList[0]],[...prevHallArr]];

                        newVenues = [...venues];
                        console.log('chosenVenue[0]',
                            chosenVenue[0]);
                        console.log('chosenVenue[1]',
                            chosenVenue[1]);
                        console.log('venues.indexOf(chosenVenue[0])',
                            newVenues.indexOf(chosenVenue[0]));
                        console.log('venues.indexOf(chosenVenue[1])',
                            newVenues.indexOf(chosenVenue[1]));
                        newVenues.splice(venues.indexOf(hallIndex), 1);
                        newVenues.splice(venues.indexOf(prevHallIndex), 1);
                    }//else
                }
                else {
                    sortedVenueList = chosenVenueList.sort((a, b) => a[1] - b[1]);
                    console.log('sortedVenueList ', sortedVenueList);
                    console.log('chosenVenueList chk', chosenVenueList);
                    chosenVenue = sortedVenueList[0];
                    console.log('chosenVenue ', chosenVenue);
                    newVenues = [...venues];
                    console.log('index of venue', venues.indexOf(chosenVenue))
                    newVenues.splice(venues.indexOf(chosenVenue), 1);

                }
                if (venues.length === initialVenues.length) {
                    // newMatrix=[...matrix].splice(matrix.indexOf(dateTime),1);
                    let tmp = [...matrix];

                    console.log('matrix.indexOf(dateTime) ', matrix.indexOf(dateTime),);
                    tmp.splice(matrix.indexOf(dateTime), 1);
                    newMatrix = [...tmp];
                }
                else
                    newMatrix = [...matrix];

                newCourses = JSON.parse(JSON.stringify(courses))
                let found = false;
                let p = [['a'], ['b'], ['c']];


                for (let x in newCourses[level]) {

                    if (JSON.stringify(newCourses[level][x]) === JSON.stringify(chosenCourse)) {
                        console.log('found at ', x);
                        newCourses[level].splice(x, 1);
                    }
                    else
                        console.log('not found at ', x);
                }
                console.log('courses ', courses);
                console.log('newCourses ', newCourses);

                console.log('newVenues ', newVenues);
                console.log('venues ', venues);
                console.log('initialVenues ', initialVenues);


                levelTimeTables[level] = (levelTimeTables[level]) ?
                    [...levelTimeTables[level], [dateTime, [...chosenCourse], chosenVenue]]
                    : [[dateTime, [...chosenCourse], chosenVenue]];

                console.log('levelTimeTables[level] ', levelTimeTables[level]);
                console.log('levels.indexOf(level) ', levels.indexOf(level));
                console.log('newVenues.length ', newVenues.length);

                //last level and no venues
                if ((levels.indexOf(level) + 1 >= levels.length) && !newVenues.length) {
                    console.log('last level and no venues');
                    return genTable(levels[0], JSON.parse(JSON.stringify(newCourses)),
                        [...initialVenues], initialVenues,
                        newMatrix, dateTime, levels);
                }
                //last level and there is still free venue 
                else if ((levels.indexOf(level) + 1 >= levels.length) && newVenues.length) {
                    console.log('last level and there is still free venue ');
                    return genTable(levels[0], JSON.parse(JSON.stringify(newCourses)),
                        [...initialVenues], initialVenues,
                        newMatrix, dateTime, levels);
                }
                //not last level and there is still free venue 
                else if (!(levels.indexOf(level) + 1 >= levels.length) && newVenues.length) {
                    console.log('not last level and there is still free venue ');
                    return genTable(levels[levels.indexOf(level) + 1],
                        JSON.parse(JSON.stringify(newCourses)), [...initialVenues], initialVenues,
                        newMatrix, dateTime, levels);
                }
                //not last level and there is no free venue 
                else if (!(levels.indexOf(level) + 1 >= levels.length) && !newVenues.length) {
                    console.log('not last level and there is no free venue ');
                    return genTable(levels[levels.indexOf(level) + 1],
                        JSON.parse(JSON.stringify(newCourses)), [...initialVenues], initialVenues,
                        newMatrix, dateTime, levels);
                }

                //  }
            }
            return 1
        }


        //genTable('100', JSON.parse(JSON.stringify(coursesForTable)), examVenues, [...examVenues], tableMatrix, null, allLevels)


        const genFinished = genTable('100', JSON.parse(JSON.stringify(coursesForTable)),
            examHalls, [...examHalls], tableMatrix, null, ['100', '200', '300', '400'])



        console.log('genFinished ', genFinished);

        console.log('levelTimeTables ', levelTimeTables);
        /*   return tableObjectBuilder(timeTable, levelTimeTables,
              tableMatrix, examDates, examTimes, levelIndx) */

        levelTimeTables['matrix'] = [...tableMatrix];
        levelTimeTables['examDates'] = [...examDates];
        levelTimeTables['examTimes'] = [...examTimes];

        setTimeTable(JSON.parse(JSON.stringify(levelTimeTables)));


        //setMatrix(tableMatrix);
    }

    console.log('timetb Ish ', Object.keys(allTimeTable).length);
    //build tables if courses have been sorted
    if (level1Course.length && level2Course.length && level3Course.length &&
        level4Course.length && !(Object.keys(allTimeTable).length)) {
        tableArrayBuilder();
    }


    const saveTimeTable = () => {
        if (Object.keys(allTimeTable).length) {
            setBlockView(true);
            const formData = new FormData();
            const timeTableData = {
                timetable: {
                    '100': allTimeTable['100'],
                    '200': allTimeTable['200'],
                    '300': allTimeTable['300'],
                    '400': allTimeTable['400']
                },
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                breakPerPeriod: breakPerPeriod,
                periodsPerDay: periodsPerDay,
                hoursPerPeriod: hoursPerPeriod,
                matrix: allTimeTable.matrix,
                examDates: allTimeTable.examDates,
                examTimes: allTimeTable.examTimes,
                courses: courses
            }

            console.log(timeTableData);

            /*  const startDate = '2022-11-10';
             const endDate = '2022-12-4';
             const startTime = '08:00';
             const breakPerPeriod = '30';
             const periodsPerDay = 3;
             const hoursPerPeriod = 3;
       */
            const content = {

                'timeTable': JSON.stringify(timeTableData),
                'semester': semester,
                'session': session
            };

            console.log(content);
            for (let item in content) {
                console.log(item, content[item]);
                formData.append(item, content[item]);
            }
            console.log(formData);

            fetch(url + '/addTimetable', {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then((response) => {
                response.json().then((body) => {
                    if (response.status !== 200) {
                        //failed
                        setBlockView(false);
                        setBanner(2);

                    }
                    else if (body.respCode === 1) {
                        // successful
                        console.log(body);
                        setBlockView(false);

                        setShowModal(true);
                        //          navigate('/home', { replace: true })
                        // setShowModal(true);
                    }
                    else {
                        //failed
                        setBlockView(false);
                        setBanner(2);
                        return
                    }
                });

            });
        }
        else {
            setBanner(2);
            return
        }
    }

    const addIssuedItem = (reqId, setIssuedItems, issuedItems) => {
        setIssuedItems([...issuedItems, reqId]);
    }


    const removeIssuedItem = (issuedItems, setIssuedItems, reqId) => {
        let newArr = [...issuedItems];
        const index = issuedItems.indexOf(reqId);
        newArr.splice(index, 1);
        setIssuedItems(newArr);


    }

    const genHeader = (arr) => {
        return arr.map((item) =>
            <th>
                {item}
            </th>
        );
    }

    const genBody = (arr) => {
        return arr.map((item) =>
            <tr>
                {item.map((obj) =>
                    <td>

                    </td>)}
            </tr>
        );
    }



    const tableForLevels = (coursesArr, stateObjArr) => {
        console.log('tableForLevels');
        return coursesArr.map((courseList) => {
            const indx = coursesArr.indexOf(courseList);
            console.log('tableForLevels  2');
            console.log('coursesArr ', indx, coursesArr);
            return (
                <>
                    <h4 className="text-light">{allLevels[indx]} Level Timetable</h4>
                    {tableObjectBuilder(allTimeTable, indx)}
                    {/*  <Table bordered hover striped responsive>
                       
                    </Table> */}
                </>);
        }
        );
    }

    console.log('time table status ', Object.values(allTimeTable).filter(item => item.length > 0)[0])
    return (
        <Container className="p-4 bg-danger text-center">
            {/*  <Row className="p-2 bg-dark text-light">
                New  Time Table
            </Row> */}
            <Container>
                {(level1Course.length && level2Course && level3Course
                    && level4Course && Object.values(allTimeTable).filter(item => item.length > 0)[0]) ?
                    tableForLevels([level1Course, level2Course, level3Course, level4Course],
                        [setLevel1Table, setLevel2Table, setLevel3Table, setLevel4Table]) : null



                }
            </Container>
            <Button onClick={saveTimeTable}>
                Save
            </Button>


            <Modal show={showModal} centered size="sm" className="text-center">
                <ModalBody>
                    <Card>
                        Timetable saved
                        <Button onClick={() => {
                            setShowModal(false);
                            navigate('/administrator', { replace: true })

                        }}>
                            Dismiss
                        </Button>
                    </Card>
                </ModalBody>
            </Modal>

            <Modal show={blockView} centered size="sm" className="text-center">
                <ModalBody>
                    <Container >
                        <Spinner animation="grow" />
                        <Spinner animation="grow" />
                        <Spinner animation="grow" />
                        <Spinner animation="grow" />
                        <Spinner animation="grow" />
                        <Spinner animation="grow" />
                    </Container>
                    Processing...
                </ModalBody>
            </Modal>


        </Container>
    );
}

export default ShowTable;