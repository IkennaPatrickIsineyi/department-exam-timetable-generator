import { Form, Button, Container, Alert, Dropdown, Spinner, Row, Col, Table, Modal, ModalBody, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sharedVariables } from './sharedVariables';

function ViewCourse() {
    const [level1CourseCode, setLevel1CourseCode] = useState('');
    //const [courses, setCourses] = useState('');


    const [showBanner, setBanner] = useState(0);
    const bannerText = ["", "Success...Logged in", "Complete the form",
        "A user is already logged in", "Failed to send request"];

    const [edit, setEdit] = useState(false);

    const [newPopulation, setNewPopulation] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [blockView, setBlockView] = useState(false);
    const [showTab1, setShowTab1] = useState(true);
    const [showTab2, setShowTab2] = useState(true);
    const [showTab3, setShowTab3] = useState(true);
    const [showTab4, setShowTab4] = useState(true);

    const navigate = useNavigate();

    const locations = useLocation();
    const url = sharedVariables.url;

    const courses = locations.state.courses;
    let count = 1;

    console.log('newPopu', newPopulation);


    const deleteCourse = (courseCode) => {
        setBlockView(true);
        const formData = new FormData();
        const content = {
            'courseCode': courseCode
        };
        console.log(content);
        for (let item in content) {
            console.log(item, content[item]);
            formData.append(item, content[item]);
        }
        console.log(formData);

        fetch(url + '/deleteCourses', {
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

                    if (body.data.length) {
                        navigate('/viewCourses',
                            {
                                replace: true,
                                state: { courses: body.data }
                            });
                        setShowModal(true);
                    }
                    else {
                        navigate('/entry')
                        setShowModal(true);
                    }

                    //setBanner(1);
                    // <Entry />
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

    const saveChanges = () => {
        setBlockView(true);
        const formData = new FormData();
        const content = {
            'newValues': JSON.stringify(newPopulation)
        };
        console.log(content);
        for (let item in content) {
            console.log(item, content[item]);
            formData.append(item, content[item]);
        }
        console.log(formData);

        fetch(url + '/updateCourses', {
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
                    setEdit(!edit)
                    //setShowModal(true);
                    //setBanner(1);
                    // <Entry />
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

    return (
        <Container className='bg-danger text-light p-3'>

            <Container className='p-3 bg-dark text-light text-center'>
                <Row >
                    <Col>
                        <h3>
                            Courses
                        </h3>
                    </Col>
                    <Col>
                        <Button onClick={() => { (edit) ? saveChanges() : setEdit(!edit) }}>
                            {(edit) ? 'Save' : 'Edit'}
                        </Button>
                    </Col>
                </Row>

            </Container>


            <Table bordered responsive className='bg-dark text-light text-center'>
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Level</th>
                        <th>Semester</th>
                        <th>Population</th>
                    </tr>
                </thead>
                {courses.map(item =>
                    <tbody>
                        <tr>
                            <td>{count++}</td>
                            <td>{item.courseCode}</td>
                            <td>{item.title}</td>
                            <td>{item.level}</td>
                            <td>{item.semester}</td>
                            {(edit) ?
                                <td>
                                    <Form.Control className='text-center' type='text' placeholder='Course Code'
                                        onChange={(event) => {
                                            setBanner(0);
                                            setNewPopulation({ ...newPopulation, [item.courseCode]: event.target.value })
                                        }}
                                        value={newPopulation[item.courseCode] ?? item.population} />
                                </td>
                                : <td>{newPopulation[item.courseCode] ?? item.population}</td>
                            }

                            <td>
                                <Button onClick={() => deleteCourse(item.courseCode)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                )}
            </Table>

            <Modal show={showModal} centered size="sm" className="text-center">
                <ModalBody>
                    <Card>
                        Course deleted
                        <Button onClick={() => { setShowModal(false); }}>
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

export default ViewCourse;