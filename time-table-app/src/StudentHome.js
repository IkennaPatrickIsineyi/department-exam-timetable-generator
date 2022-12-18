import { Form, Button, Container, Alert, Spinner, Row, DropdownButton, Col, Card, ModalBody, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { json, useLocation, useNavigate } from 'react-router-dom';
import { sharedVariables } from './sharedVariables';
//import { Navigate } from 'react-router-dom';


function StudentHome(props) {

    const [session, setSession] = useState('');
    const [semester, setSemester] = useState('');

    const [showSemesters, setShowSemesters] = useState(false);
    const [showSessions, setShowSessions] = useState(false);

    const [availableSemesters, setAvailableSemesters] = useState([]);

    const [currentView, setCurrentView] = useState(0);
    const [showBanner, setBanner] = useState(0);
    const bannerText = ["", "Success...Logged in", "Invalid Login Data",
        "A user is already logged in", "Unknown error occurred"];

    const navigate = useNavigate();
    const users = { admin: '/admin', student: '/student' };
    const location = useLocation();
    const url = sharedVariables.url;
    //  const selectedDesignation = props.selectedDesignation;
    //   console.log('login', selectedDesignation);

    const backgroundImg = 'optoPic.png';

    const availableSessionData = location.state.requiredData;

    const formProcessor = (event) => {
        event.preventDefault();
        // if (chosenStock && chosenSupplier && qty && dateAdded) {
        console.log('selected data ', session, semester);
        if (semester.length && session.length) {
            //setBlockView(true);
            const formData = new FormData();
            const content = {
                'session': session,
                'semester': semester,
                /* 'stockId': JSON.stringify(chosenStock.stockId),
                'supplierId': JSON.stringify(chosenSupplier.supplierId),
                'qty': qty,
                'dateAdded': dateAdded */
            };
            console.log(content);
            for (let item in content) {
                console.log(item, content[item]);
                formData.append(item, content[item]);
            }
            console.log(formData);

            fetch(url + '/getTimeTable', {
                method: 'POST',
                credentials: 'include',
                body: formData
                /*  headers: {
                     'Content-Type': 'application/json'
                 } */
            }).then((response) => {
                response.json().then((body) => {
                    if (response.status !== 200) {
                        //failed
                        /*    setBlockView(false);
                           setBanner(2); */
                    }
                    else if (body.respCode === 1) {
                        // successful
                        console.log('result body', body);
                        if (body.data.length) {
                            console.log('found', body.data[0].timetable);
                            const table = JSON.parse(body.data[0].timetable);
                            console.log('clear data', table);
                            navigate('/viewTimeTable',
                                {
                                    replace: false, state: {
                                        courses: table.courses,
                                        halls: [['LT200', 200], ['LT1000', 1000], ['LT500', 500]],
                                        periodsPerDay: table.periodsPerDay,
                                        startDate: table.startDate, endDate: table.endDate, startTime: table.startTime,
                                        breakPerPeriod: table.breakPerPeriod, hoursPerPeriod: table.hoursPerPeriod,
                                        semester: body.data[0].semester, session: body.data[0].session,
                                        timeTable: table.timetable,
                                        examTimes: table.examTimes,
                                        examDates: table.examDates,
                                        matrix: table.matrix,
                                    }
                                });

                            /* 
                             const timeTable = {
        '100': [['Fri Nov 11 2022  8:00:00  - 11:00:00', ['cA', 'tCA', '100'], ['LT200', 200]],
        ['Wed Nov 16 2022  3:00:00  - 6:00:00', ['cB', 'tCA', '100'], ['LT500', 500]]],
        '200': [['Wed Nov 23 2022  11:30:00  - 2:30:00', ['cC', 'tCA', '200'], ['LT1000', 1000]],
        ['Thu Dec 01 2022  8:00:00  - 11:00:00', ['cD', 'tCA', '200'], ['LT200', 200]]],
        '300': [['Mon Nov 14 2022  8:00:00  - 11:00:00', ['cE', 'tCA', '300'], ['LT500', 500]]],
        '400': [['Fri Nov 25 2022  8:00:00  - 11:00:00', ['cF', 'tCA', '400'], ['LT1000', 1000]]]
    }


    const startDate = '2022-11-10';
    const endDate = '2022-12-4';
    const startTime = '08:00';
    const breakPerPeriod = '30';
    const periodsPerDay = 3;
    const hoursPerPeriod = 3;
    const courses = [['cA', 'tCA', '100'], ['cB', 'tCA', '100'], ['cC', 'tCA', '200'],
    ['cD', 'tCA', '100'], ['cE', 'tCA', '200'], ['cF', 'tCA', '300'],
    ['cG', 'tCA', '400']];
 */
                        }
                        else {
                            console.log('none found');
                        }
                        // setBlockView(false);
                        //setShowModal(true);
                        // <Entry />
                    }
                    else {
                        //failed
                        /* setBlockView(false);
                        setBanner(2); */
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


    const defaultView = (
        <Container className='has-bg-img bg-danger text-light p-4 text-center' >

            <h1 className='text-center'>Find Timetable</h1>

            <Alert show={showBanner} variant={(showBanner === 1) ? 'success' : 'danger'}>{bannerText[showBanner]}</Alert>

            <Form onSubmit={formProcessor}>
                {/* 
                <Form.Group className='mb-3'>

                    <Form.Label>
                        session
                    </Form.Label>

                    <Form.Control type='text' placeholder='Enter session (year/year)'
                        onChange={(event) => {
                            setBanner(0);
                            setSession(event.target.value)
                        }} value={session} />

                </Form.Group>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        semester
                    </Form.Label>

                    <Form.Control type='text' placeholder='Enter semester (1st or 2nd)'
                        onChange={(event) => {
                            setBanner(0);
                            setSemester(event.target.value)
                        }} value={semester} />
                </Form.Group>
 */}
                <Form.Group className='m-4 '>
                    <Button variant='dark' className='' onClick={() => { setShowSessions(!showSessions) }} >
                        <Container >
                            <Row>
                                {'Select session: ' + session}
                                <Col >
                                    <DropdownButton show={false} onClick={() => { setShowSessions(!showSessions) }} />
                                </Col>
                            </Row>
                        </Container>
                    </Button>
                </Form.Group>

                <Modal show={showSessions} centered size="sm" className="text-center">
                    <ModalBody>
                        {availableSessionData.map(item =>
                            <Card>
                                <Button onClick={() => { setSession(item.session); setShowSessions(false) }}>
                                    {item.session}
                                </Button>
                            </Card>
                        )}
                        <Card>
                            <Button className='mt-3' variant='danger' onClick={() => { setShowSessions(false) }}>
                                Dismiss
                            </Button>
                        </Card>
                    </ModalBody>
                </Modal>

                <Form.Group className='mb-3'>
                    <Button variant='dark' className='mb-3' onClick={() => { setShowSemesters(!showSemesters) }} >
                        <Container >
                            <Row>
                                {'Select semester: ' + semester}
                                <Col >
                                    <DropdownButton show={false} onClick={() => { setShowSemesters(!showSemesters) }} />
                                </Col>
                            </Row>
                        </Container>
                    </Button>
                </Form.Group>


                <Modal scrollable={true} show={showSemesters} centered size="sm" className="text-center">
                    <ModalBody className='m-2'>
                        {(session.length) ? availableSessionData.filter(obj => obj.session === session).map(item =>
                            <Card>
                                <Button onClick={() => { setSemester(item.semester); setShowSemesters(false) }}>
                                    {item.semester} semester
                                </Button>
                            </Card>

                        ) : null}

                        <Card>
                            <Button className='mt-3' variant='danger' onClick={() => { setShowSemesters(false) }}>
                                Dismiss
                            </Button>
                        </Card>
                    </ModalBody>
                </Modal>

                <Button variant='primary' type='submit' className='m-4' >
                    Find timetable
                </Button>

            </Form>
        </Container>
    );

    const Views = [defaultView];
    return Views[currentView]
}
export default StudentHome;