import { useEffect, useState } from "react";
import { Card, Col, Container, Button, Row, Table, Modal, ModalBody, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { sharedVariables } from "./sharedVariables";
const passport = 'passport.jpg';

function NewTimeTable(props) {
    const [timeTable, setTimeTable] = useState([]);
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
        courseStateObj(newArr);

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

    const tableObjectBuilder = (timetb, matrix, examDates, examTimes, levelIndx) => {
        const rowCount = examDates.length;
        const colCount = examTimes.length;
        const prod = rowCount * colCount;
        const examDatesArr = [...Array(rowCount).keys()];
        const examTimesArr = [...Array(colCount).keys()];
        let count = 0;

        console.log('tableObjectBuilder');
        console.log('timetb', timetb);
        console.log('matrix[1]', matrix[1]);
        console.log('cell[1]', timetb.filter((cell) => {
            console.log('inner cell[0]', cell[0]);
            return cell[0] === matrix[1]
        }));



        // let tmpCell = [];

        const genCell = (value) => {
            const tmpCell = timetb.filter((cell) => cell[0] === matrix[value]);
            // console.log('tmpCell', tmpCell);
            ++count;
            // console.log('cell value', (tmpCell.length) ? tmpCell[0][1][0] : null);
            return (tmpCell.length) ? tmpCell[0][1][0] : null
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


    const tableArrayBuilder = (courses, tableStateObj, levelIndx) => {

        /* 
        input formats: 
        const courses=['cA','cB','cC','cD','cE'];
        const startDate='2022-11-10';
        const endDate='2022-12-4';
        const startTime='08:00';
        const breakPerPeriod='30';
        const periodsPerDay=4; */

        const numOfCourses = courses.length;
        console.log('courses 1', courses);
        const numOfDays = Math.ceil((new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24));
        console.log(numOfDays);
        const days1 = [...Array(numOfDays).keys()];
        console.log(days1);
        let days = [...days1];
        let table = [];
        let tableMatrix = [];
        let timeTable = [];

        const to12HrForm = (time) => {
            const hour = time.substring(0, 2);
            const minute = time.slice(2);
            console.log('hour,minute', hour, minute);
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
            console.log(tmpStartTime.toLocaleTimeString());
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

        const copyTableMatrix = [...tableMatrix];
        for (let course of courses) {
            console.log('ran');
            const pick = pickRandomElement(copyTableMatrix);
            timeTable.push([pick, course]);
            copyTableMatrix.splice(copyTableMatrix.indexOf(pick), 1);
        }

        console.log('timeTable', timeTable);

        return tableObjectBuilder(timeTable, tableMatrix, examDates, examTimes, levelIndx)

        //tableStateObj( timeTable);
        //setMatrix(tableMatrix);
    }


    const saveTimeTable = (issuedItems) => {
        if (issuedItems.length) {
            setBlockView(true);
            const formData = new FormData();
            const content = {
                'startDate': startDate,
                'endDate': endDate,
                'periodsPerDay': periodsPerDay,
                'startTime': startTime,
                'hoursPerPeriod': hoursPerPeriod,
                'breakPerPeriod': breakPerPeriod,
                'timeTable': JSON.stringify(timeTable)
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
                    {tableArrayBuilder(courseList, stateObjArr[indx], indx)}
                    {/*  <Table bordered hover striped responsive>
                       
                    </Table> */}
                </>);
        }
        );
    }

    return (
        <Container className="p-4 bg-danger text-center">
            {/*  <Row className="p-2 bg-dark text-light">
                New  Time Table
            </Row> */}
            <Container>
                {(level1Course.length && level2Course && level3Course && level4Course) ?
                    tableForLevels([level1Course, level2Course, level3Course, level4Course],
                        [setLevel1Table, setLevel2Table, setLevel3Table, setLevel4Table]) : null}
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
                            navigate('/home', { replace: true })
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

export default NewTimeTable;