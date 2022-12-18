import { useState } from "react";
import { Card, Col, Container, Button, Row, Table, Modal, ModalBody, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { sharedVariables } from "./sharedVariables";
const passport = 'passport.jpg';

function ViewTimeTable(props) {
    const [showBanner, setBanner] = useState(0);

    const [level1Course, setLevel1Course] = useState([]);
    const [level2Course, setLevel2Course] = useState([]);
    const [level3Course, setLevel3Course] = useState([]);
    const [level4Course, setLevel4Course] = useState([]);

    // const [matrix, setMatrix] = useState([]);

    const [level1Table, setLevel1Table] = useState([]);
    const [level2Table, setLevel2Table] = useState([]);
    const [level3Table, setLevel3Table] = useState([]);
    const [level4Table, setLevel4Table] = useState([]);


    const allLevels = ['100', '200', '300', '400'];
    //  const [examTimes, setExamTimes] = useState([]);
    //   const [examDates, setExamDates] = useState([]);

    /* Timetable format */
    /*  const timeTable = {
         '100': [['Fri Nov 11 2022  8:00:00  - 11:00:00', ['cA', 'tCA', '100'], ['LT200', 200]],
         ['Wed Nov 16 2022  3:00:00  - 6:00:00', ['cB', 'tCA', '100'], ['LT500', 500]]],
         '200': [['Wed Nov 23 2022  11:30:00  - 2:30:00', ['cC', 'tCA', '200'], ['LT1000', 1000]],
         ['Thu Dec 01 2022  8:00:00  - 11:00:00', ['cD', 'tCA', '200'], ['LT200', 200]]],
         '300': [['Mon Nov 14 2022  8:00:00  - 11:00:00', ['cE', 'tCA', '300'], ['LT500', 500]]],
         '400': [['Fri Nov 25 2022  8:00:00  - 11:00:00', ['cF', 'tCA', '400'], ['LT1000', 1000]]]
     }
  */

    /*   const startDate = '2022-11-10';
      const endDate = '2022-12-4';
      const startTime = '08:00';
      const breakPerPeriod = '30';
      const periodsPerDay = 3;
      const hoursPerPeriod = 3;
      const courses = [['cA', 'tCA', '100'], ['cB', 'tCA', '100'], ['cC', 'tCA', '200'],
      ['cD', 'tCA', '100'], ['cE', 'tCA', '200'], ['cF', 'tCA', '300'],
      ['cG', 'tCA', '400']]; */

    //  let examTimes = [];
    //  let examDates = [];

    const locations = useLocation();
    const navigate = useNavigate();

    const bannerText = ["", "Account created", "Something went wrong...try again",
        "You are not logged in... Login"];
    const alertColors = ["danger", "success", "warning", "secondary"];

    const [showModal, setShowModal] = useState(false);
    const [blockView, setBlockView] = useState(false);

    const url = sharedVariables.url;


    const timeTable = locations.state.timeTable;
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
    const examDates = locations.state.examDates;
    const examTimes = locations.state.examTimes;
    const matrix = locations.state.matrix;

    /* const courses = props.courses;
    const startDate = props.startDate;
    const endDate = props.endDate;
    const periodsPerDay = props.periodsPerDay;
    const startTime = props.startTime;
    const hoursPerPeriod = props.hoursPerPeriod;
    const breakPerPeriod = props.breakPerPeriod;
    const timeTable = JSON.parse(props.timeTable); */

    // const data = props.reqItems;

    //const data = locations.state.reqItems;

    /* if(level1Table.length ||level2Table.length ||level3Table.length ||level4Table.length)
    {
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
    }
 */
    const setCourse1 = (value, timeTableArr) => {
        console.log('100L ', timeTableArr);
        setLevel1Course(value);
        setLevel1Table(timeTableArr);
    }
    const setCourse2 = (value, timeTableArr) => {
        console.log('200L ', timeTableArr);
        setLevel2Course(value);
        setLevel2Table(timeTableArr);
    }
    const setCourse3 = (value, timeTableArr) => {
        console.log('300L ', timeTableArr);
        setLevel3Course(value);
        setLevel3Table(timeTableArr);
    }
    const setCourse4 = (value, timeTableArr) => {
        console.log('400L ', timeTableArr);
        setLevel4Course(value);
        setLevel4Table(timeTableArr);
    }

    console.log('timetables ', level1Table, level2Table, level3Table, level4Table);

    const sortCourses = (courses, courseStateObj, level, stateValue, timeTableObj) => {
        console.log(courses, level);
        console.log('filtered courses', courses.filter((course) => course[2] === level))
        const newArr = courses.filter((course) => course[2] === level);
        console.log('newarr', newArr);
        const timeTableArr = timeTableObj[level];
        console.log(level, 'level timeTableArr', timeTableArr);
        courseStateObj(newArr, timeTableArr);

        console.log('stateValue', stateValue)
    }

    for (let level of ['100', '200', '300', '400']) {
        const stateObjArr = [setCourse1, setCourse2,
            setCourse3, setCourse4];
        const stateValue = [level1Course, level2Course,
            level3Course, level4Course];

        const setTables = [setLevel1Table, setLevel2Table, setLevel3Table, setLevel4Table]

        const indx = ['100', '200', '300', '400'].indexOf(level);
        console.log('stateValue[indx]', stateValue[indx]);
        if (!((stateValue[indx]).length))
            sortCourses(courses, stateObjArr[indx], level, stateValue[indx], timeTable);
    }

    const tableObjectBuilder = (timetb, matrix, examDates, examTimes, levelIndx) => {
        const rowCount = examDates.length;
        const colCount = examTimes.length;
        const prod = rowCount * colCount;
        const examDatesArr = [...Array(rowCount).keys()];
        const examTimesArr = [...Array(colCount).keys()];
        let count = 0;

        console.log('tableObjectBuilder');
        console.log('timetb', timetb);
        /*  console.log('cell[1]', timetb.filter((cell) => {
             console.log('inner cell[0]', cell[0]);
             return cell[0] === matrix[1]
         })); */

        // let tmpCell = [];

        const genCell = (value) => {
            // console.log('value ', value);
            const tmpCell = timetb.filter((cell) => {
                /*  console.log('cell[0]', cell[0]);
                 console.log('matrix', value, matrix[value])
                 console.log('compared ', cell[0].trim() === matrix[value].trim()) */
                return cell[0].trim() === matrix[value].trim()
            });
            // console.log('tmpCell', tmpCell);
            ++count;
            let venueName = [];
            // console.log('cell value', (tmpCell.length) ? tmpCell[0][1][0] : null);
            // return (tmpCell.length) ? tmpCell[0][1][0] : null
            if (tmpCell.length) {
                console.log('length', tmpCell[0][2].length);
                const datatype = typeof tmpCell[0][2][0];
                console.log('type', datatype);
                venueName = (datatype === 'object') ? tmpCell[0][2].map(item => item[0]) : tmpCell[0][2][0]
            }

            return (tmpCell.length) ? tmpCell[0][1][0] + ' (' + venueName + ')' : null
        }

        return <Table bordered striped responsive size="sm">
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

    const tableArrayBuilder = (courses, timeTable, levelIndx) => {

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
            (1000 * 60 * 60 * 24));
        // console.log(numOfDays);
        const days1 = [...Array(numOfDays).keys()];
        //console.log(days1);
        let days = [...days1];
        let table = [];
        // let tableMatrix = [];
        let tableMatrix = [...matrix];

        const to12HrForm = (time) => {
            const hour = time.substring(0, 2);
            const minute = time.slice(2);
            //console.log('hour,minute', hour, minute);
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
            //   console.log(tmpStartTime.toLocaleTimeString());
            const time1 = tmpStartTime.toLocaleTimeString().slice(0, 8);
            tmpStartTime.setMinutes(tmpStartTime.getMinutes() + (hoursPerPeriod * 60));
            const time2 = tmpStartTime.toLocaleTimeString().slice(0, 8);
            //return to12HrForm(time1) + ' - ' + to12HrForm(time2);
            return time1 + ' - ' + time2;
        }

        /*   const validTimes = [...Array(periodsPerDay).keys()].map((item) => {
              return genTime(item);
          }); */

        //setExamTimes(validTimes);
        //  console.log('validTimes', validTimes);

        //  examTimes = validTimes;

        const genDay1 = (dayNum) => {
            //const dayNum=pickRandomElement(days);
            const dayDate = new Date(startDate)
            dayDate.setDate(dayDate.getDate() + dayNum);

            const valu = (dayDate.getDay() === 0) ?
                null : dayDate.toDateString();
            days.splice(days.indexOf(dayNum), 1);
            //console.log('dt', valu)

            return valu;
        }

        // const allDates = [...Array(numOfDays).keys()].map((item) => genDay1(item));
        // const allDates2 = allDates.filter((item) => item !== null);

        //setExamDates(allDates);

        //   examDates = allDates2;

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
            // console.log('dt', valu)

            return valu;
        }


        /*   for (let date of examDates) {
              for (let time of examTimes) {
                  tableMatrix.push(date + '  ' + time);
              }
          } */

        console.log('tmatrix', tableMatrix);
        console.log('courses', courses);

        console.log('timeTable', timeTable);

        return tableObjectBuilder(timeTable, tableMatrix, examDates, examTimes, levelIndx)

        //tableStateObj( timeTable);
        //setMatrix(tableMatrix);
    }

    const tableForLevels = (coursesArr, tables) => {
        console.log('tableForLevels');
        console.log('filled ', Boolean(tables[4]));
        if (tables[0] && tables[1] && tables[2] && tables[3])
            return coursesArr.map((courseList) => {
                const indx = coursesArr.indexOf(courseList);
                console.log('tableForLevels  2');
                console.log('coursesArr ', indx, coursesArr);
                return (
                    <>
                        <h4 className="text-light">{allLevels[indx]} Level Timetable</h4>
                        {tableArrayBuilder(courseList, tables[indx], indx)}
                        {/*  <Table bordered hover striped responsive>
                       
                    </Table> */}
                    </>);
            });
        else
            return null
    }


    return (
        <Container className="p-4 bg-danger text-center">
            <Row className="p-2 bg-dark text-light text-center">
                <h4>  {session}  {semester} Semester Examination timetable </h4>
            </Row>
            {tableForLevels([level1Course, level2Course, level3Course, level4Course],
                [level1Table, level2Table, level3Table, level4Table])}

        </Container>
    );
}

export default ViewTimeTable;