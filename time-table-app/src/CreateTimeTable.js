import { Form, Button, Container, Alert, Spinner, Modal, ModalBody, Card, DropdownButton, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { sharedVariables } from './sharedVariables';
import { useNavigate } from 'react-router-dom';

function CreateTimeTable() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [periodsPerDay, setPeriodsPerDay] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [hoursPerPeriod, setHoursPerPeriod] = useState(0);
    const [breakPerPeriod, setBreakPerPeriod] = useState(0);
    const [allTimeTable, setAllTimeTable] = useState([]);
    const [courses, setCourses] = useState([]);

    const [session, setSession] = useState('');
    const [semester, setSemester] = useState('');

    const [showSemester, setShowSemester] = useState(false);

    const [showExtra, setShowExtra] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [blockView, setBlockView] = useState(false);
    const [showBanner, setBanner] = useState(0);
    const bannerText = ["", "Data saved", "Something went wrong...try again",
        "You are not logged in... Login", "..."];
    const alertColors = ["danger", "success", "warning", "secondary", "warning"];


    const url = sharedVariables.url;



    const navigate = useNavigate();
    const formProcessor = (event) => {
        event.preventDefault();
        if (startDate && endDate && periodsPerDay && semester && session &&
            startTime && hoursPerPeriod && breakPerPeriod) {
            const formData = new FormData();
            /*   const content = {
                  'startDate': startDate,
                  'endDate': endDate,
                  'periodsPerDay': periodsPerDay,
                  'startTime': startTime,
                  'hoursPerDay': hoursPerPeriod,
                  'breakPerPeriod': breakPerPeriod
              };
              console.log(content);
              for (let item in content) {
                  console.log(item, content[item]);
                  formData.append(item, content[item]);
              }
              console.log(formData); */



            fetch(url + '/getSemesterCourses/?semester=' + semester, {
                //  method: 'GET',
                credentials: 'include',
                //  body: formData
            }).then((response) => {
                response.json().then((body) => {
                    if (response.status !== 200) {
                        //failed
                        setBanner(2);
                    }
                    else if (body.respCode === 1) {
                        // successful
                        console.log(body);
                        const courseList = []
                        const xd = body.data.map(item => courseList.push([item.courseCode, item.title, item.level, item.population]))
                        //  setCourses(body.data);
                        console.log('courseList', courseList);
                        const numOfDays = Math.ceil((new Date(endDate) - new Date(startDate)) /
                            (1000 * 60 * 60 * 24));

                        const Level1Courses = courseList.filter((course) => course[2] === '100').length;
                        const Level2Courses = courseList.filter((course) => course[2] === '200').length;
                        const Level3Courses = courseList.filter((course) => course[2] === '300').length;
                        const Level4Courses = courseList.filter((course) => course[2] === '400').length;

                        if ((numOfDays * periodsPerDay) >= (Level1Courses + Level2Courses + Level3Courses + Level4Courses))
                            if (Level1Courses && Level2Courses && Level3Courses && Level4Courses) {
                                console.log('all levels have courses')
                                navigate('/showTable',
                                    {
                                        replace: false, state: {
                                            courses: courseList,
                                            halls: [['LT200', 200], ['LT1000', 1000], ['LT500', 500]
                                            ].map(item => [item[0], item[1] / 2]),
                                            periodsPerDay: periodsPerDay,
                                            startDate: startDate, endDate: endDate, startTime: startTime,
                                            breakPerPeriod: breakPerPeriod, hoursPerPeriod: hoursPerPeriod,
                                            session: session, semester: semester
                                        }
                                    });
                            }
                            else {
                                console.log('no courses in some levels')
                                setShowModal(true);

                            }
                        else {
                            console.log('Extra days or periods required')
                            setShowExtra(true);
                        }

                        // <Entry />
                    }
                    else {
                        //failed
                        setBanner(2);
                        return
                    }
                });

            });
        }
        else {
            setBanner(4);
            return
        }
    }

    //createAccount/?password=ikepass&firstname=iken&lastname=isi&designation=doctor&
    //address=amad street&phonenumber=975735&image=umaiai.jpg&birthday=2002/4/23&dateemployed=2022/4/23
    console.log('odj test  ', Object.keys({ /* a: 'ab', b: 'ef'  */ }).length);
    return (
        //  <>
        <Container className='bg-danger text-light pb-3'>

            <Container className='p-3 bg-dark text-light'>
                <h3>
                    Create Time Table
                </h3>
            </Container>

            <Alert show={showBanner} variant={alertColors[showBanner]}>{bannerText[showBanner]}</Alert>
            <Form onSubmit={formProcessor}>

                <Form.Group className='mb-3'>
                    <Form.Label>
                        Session
                    </Form.Label>

                    <Form.Control type='text' placeholder='Enter session'
                        onChange={(event) => {
                            setBanner(0);
                            setSession(event.target.value)
                        }} value={session} />
                </Form.Group>

                <Form.Group className='mb-1'>
                    <Button variant='dark' className='mb-1' onClick={() => { setShowSemester(!showSemester) }} >
                        <Container >
                            <Row>
                                {'Select Semester: ' + semester + ((semester.length) ? ' semester' : '')}
                                <Col >
                                    <DropdownButton show={false} onClick={() => { setShowSemester(!showSemester) }} />
                                </Col>
                            </Row>
                        </Container>
                    </Button>
                </Form.Group>


                <Modal show={showSemester} centered size="sm" className="text-center">
                    <ModalBody>

                        <Card>
                            <Button onClick={() => { setSemester('1st'); setShowSemester(false) }}>
                                1st Semester
                            </Button>
                        </Card>

                        <Card>
                            <Button onClick={() => { setSemester('2nd'); setShowSemester(false) }}>
                                2nd Semester
                            </Button>
                        </Card>


                    </ModalBody>
                </Modal>


                <Form.Group className='mb-3'>
                    <Form.Label>
                        Starting date
                    </Form.Label>

                    <Form.Control type='date' placeholder='Enter starting date'
                        onChange={(event) => {
                            setBanner(0);
                            setStartDate(event.target.value)
                        }} value={startDate} />
                </Form.Group>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        Finishing date
                    </Form.Label>

                    <Form.Control type="date" placeholder='Enter finishing date'
                        onChange={(event) => {
                            setBanner(0);
                            setEndDate(event.target.value)
                        }} value={endDate} />
                </Form.Group>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        Time of first paper
                    </Form.Label>

                    <Form.Control type="time" placeholder='Enter first paper time'
                        onChange={(event) => {
                            setBanner(0);
                            setStartTime(event.target.value)
                        }} value={startTime} />
                </Form.Group>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        Exam periods per day
                    </Form.Label>

                    <Form.Control type="number" placeholder='Enter number of periods'
                        onChange={(event) => {
                            setBanner(0);
                            setPeriodsPerDay(event.target.value)
                        }} value={periodsPerDay} />
                </Form.Group>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        Hours per period
                    </Form.Label>

                    <Form.Control type="number" placeholder='Enter period duration'
                        onChange={(event) => {
                            setBanner(0);
                            setHoursPerPeriod(event.target.value)
                        }} value={hoursPerPeriod} />
                </Form.Group>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        Break per period in minutes
                    </Form.Label>

                    <Form.Control type="number" placeholder='Enter in minutes'
                        onChange={(event) => {
                            setBanner(0);
                            setBreakPerPeriod(event.target.value)
                        }} value={breakPerPeriod} />
                </Form.Group>

                <Button variant='primary' type='submit'
                    onClick={formProcessor
                        /* courses={courses} periodsPerDay={periodsPerDay}
            startDate={startDate} endDate={endDate} startTime={startTime}
            breakPerPeriod={breakPerPeriod} hoursPerPeriod={hoursPerPeriod}
            
             const allCourses={'100':[['cA','cAt',130],['cB','cBt',90],
        ['cC','cCt',200]], '200':[['cD','cDt',120],['cE','cEt',39],
        ['cF','cFt',358]], '300':[['cG','cGt',289],['cH','cHt',170],
        ['cI','cIt',148]], '400':[['cJ','cJt',278],['cK','cKt',100],
        ['cL','cLt',168]]};

        () => {
                        console.log('inputs', {
                            periodsPerDay: periodsPerDay,
                            startDate: startDate, endDate: endDate, startTime: startTime,
                            breakPerPeriod: breakPerPeriod, hoursPerPeriod: hoursPerPeriod
                        });
              navigate('/showTable',
                            {
                                replace: false, state: {
                                    courses: [['cA', 'tCA', '100', 130], ['cB', 'tCA', '100', 90],
                                    ['cC', 'tCA', '200', 120], ['cH', 'tCA', '200', 39],
                                    ['cD', 'tCA', '100', 200], ['cE', 'tCA', '200', 358], ['cF', 'tCA', '300', 289],
                                    ['cG', 'tCA', '400', 100], ['cT', 'tCA', '300', 170], ['cK', 'tCA', '300', 148],
                                    ['cM', 'tCA', '400', 278], ['cL', 'tCA', '400', 168]],
                                    halls: [['LT200', 200], ['LT1000', 1000], ['LT500', 500]],
                                    periodsPerDay: periodsPerDay,
                                    startDate: startDate, endDate: endDate, startTime: startTime,
                                    breakPerPeriod: breakPerPeriod, hoursPerPeriod: hoursPerPeriod
                                }
                            });
              }
             */

                    }>
                    Submit
                </Button>

            </Form>
            <Modal show={showModal} centered size="sm" className="text-center">
                <ModalBody>
                    <Card>
                        Some Levels do not have any course...
                        Goto AddCourses...
                        Add courses to all Levels and try again
                        <Button onClick={() => { setShowModal(false); navigate(-1) }}>
                            Dismiss
                        </Button>
                    </Card>
                </ModalBody>
            </Modal>

            <Modal show={showExtra} centered size="sm" className="text-center">
                <ModalBody>
                    <Card>
                        Extra days or periods required
                        <Button onClick={() => { setShowExtra(false); }}>
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
        </Container >
        //  </>

    );
}

export default CreateTimeTable;