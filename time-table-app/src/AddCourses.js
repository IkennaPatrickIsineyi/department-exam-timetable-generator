import { Form, Button, Container, Alert, Dropdown, Spinner, Row, Col, Table, Modal, ModalBody, Card, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sharedVariables } from './sharedVariables';

function AddCourses() {
    const [level1CourseCode, setLevel1CourseCode] = useState('');
    const [level1Title, setLevel1Title] = useState('');
    const [level2CourseCode, setLevel2CourseCode] = useState('');
    const [level2Title, setLevel2Title] = useState('');
    const [level3CourseCode, setLevel3CourseCode] = useState('');
    const [level3Title, setLevel3Title] = useState('');
    const [level4CourseCode, setLevel4CourseCode] = useState('');
    const [level4Title, setLevel4Title] = useState('');

    const [level1Semester, setLevel1Semester] = useState('');
    const [level2Semester, setLevel2Semester] = useState('');
    const [level3Semester, setLevel3Semester] = useState('');
    const [level4Semester, setLevel4Semester] = useState('');

    const [level1Population, setLevel1Population] = useState();
    const [level2Population, setLevel2Population] = useState();
    const [level3Population, setLevel3Population] = useState();
    const [level4Population, setLevel4Population] = useState();


    const [showLevel1Semester, setShowLevel1Semester] = useState(false);
    const [showLevel2Semester, setShowLevel2Semester] = useState(false);
    const [showLevel3Semester, setShowLevel3Semester] = useState(false);
    const [showLevel4Semester, setShowLevel4Semester] = useState(false);

    const [level1Data, setLevel1Data] = useState([]);
    const [level2Data, setLevel2Data] = useState([]);
    const [level3Data, setLevel3Data] = useState([]);
    const [level4Data, setLevel4Data] = useState([]);

    const [showBanner, setBanner] = useState(0);
    const bannerText = ["", "Success...Logged in", "Complete the form",
        "A user is already logged in", "Failed to send request"];

    const [showModal, setShowModal] = useState(false);
    const [blockView, setBlockView] = useState(false);
    const [showTab1, setShowTab1] = useState(true);
    const [showTab2, setShowTab2] = useState(true);
    const [showTab3, setShowTab3] = useState(true);
    const [showTab4, setShowTab4] = useState(true);

    const navigate = useNavigate();

    const url = sharedVariables.url;

    const dataList = {
        '100': level1Data, '200': level2Data,
        '300': level3Data, '400': level4Data,
    }

    const removeItem = (setDataList, dataArr, item) => {
        const newArr = [...dataArr];
        /* console.log('dataList ', dataArr);
        console.log('newArr ', newArr);
        console.log('delete  ', item); */
        const index = newArr.map(obj => obj.courseCode).indexOf(item.courseCode);
        newArr.splice(index, 1);
        // console.log('newArr ', newArr);
        setDataList([...newArr]);
    }


    const formProcessor = (event) => {
        event.preventDefault();
        // if (chosenStock && chosenSupplier && qty && dateAdded) {
        if (level1Data.length || level2Data.length || level3Data.length || level4Data.length) {
            setBlockView(true);
            const formData = new FormData();
            const content = {
                'courses': JSON.stringify(dataList)
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

            fetch(url + '/addCourses', {
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
        else {
            setBanner(2);
            return
        }
    }

    const toggleTabs = (index) => {
        const tabs = { showTab1: showTab1, showTab2: showTab2, showTab3: showTab3, showTab4: showTab4 }
        const showTabs = {
            setShowTab1: setShowTab1, setShowTab2: setShowTab2,
            setShowTab3: setShowTab3, setShowTab4: setShowTab4
        }

        console.log('index ', index)

        showTabs['setShowTab' + (index + 1)](!(tabs['showTab' + (index + 1)]))
    }

    const buildDataList = (dataList, setDataList) => {
        if (dataList) {
            return (<Table bordered responsive className='text-light'>
                <thead>
                    <tr>

                        <th>Course Code name</th>
                        <th>Title </th>
                        <th>Semester </th>
                        <th>Population </th>

                    </tr>
                </thead>

                <tbody>
                    {[...dataList].map((item) => {
                        console.log(item);
                        return (
                            <tr>

                                <td>{item.courseCode}</td>
                                <td>{item.title}</td>
                                <td>{item.population}</td>
                                <td>{item.semester}</td>

                                <td>
                                    <Button variant='primary' onClick={() => {
                                        removeItem(setDataList, dataList, item);
                                    }}>
                                        Remove
                                    </Button>
                                </td>

                            </tr>
                        );
                    })
                    }
                </tbody>
            </Table>
            );
        }
    };


    const buildForm = () => {
        const levelCourseCodes = [level1CourseCode, level2CourseCode, level3CourseCode, level4CourseCode];
        const levelTitles = [level1Title, level2Title, level3Title, level4Title];
        const levelPopulations = [level1Population, level2Population, level3Population, level4Population];
        const levelSemesters = [level1Semester, level2Semester, level3Semester, level4Semester];
        const showLevelSemesters = [showLevel1Semester, showLevel2Semester, showLevel3Semester, showLevel4Semester];
        const levels = ['100', '200', '300', '400'];
        const levelData = [level1Data, level2Data, level3Data, level4Data];
        const setLevelCourseCodes = [setLevel1CourseCode, setLevel2CourseCode, setLevel3CourseCode, setLevel4CourseCode];
        const setLevelTitles = [setLevel1Title, setLevel2Title, setLevel3Title, setLevel4Title];
        const setLevelPopulation = [setLevel1Population, setLevel2Population, setLevel3Population, setLevel4Population];
        const setLevelSemester = [setLevel1Semester, setLevel2Semester, setLevel3Semester, setLevel4Semester];
        const setLevelData = [setLevel1Data, setLevel2Data, setLevel3Data, setLevel4Data];
        const setShowLevelSemesters = [setShowLevel1Semester, setShowLevel2Semester, setShowLevel3Semester, setShowLevel4Semester];
        const showTab = { showTab1: showTab1, showTab2: showTab2, showTab3: showTab3, showTab4: showTab4 }
        const loopArr = [...Array(levels.length).keys()];


        return loopArr.map((index) => {
            return (
                <Container className='pb-4'><Row>
                    <Button onClick={() => { toggleTabs(index) }}>
                        {levels[index]} Level
                    </Button>
                </Row>
                    <Container hidden={showTab['showTab' + (index + 1)]}>
                        <Row>
                            <h4 className='text-center'>  {levels[index]} Level </h4>
                        </Row>
                        <Form onSubmit={formProcessor}>
                            <Form.Group className='mb-1' >
                                <Form.Label>
                                    Course Code
                                </Form.Label>

                                <Form.Control type='text' placeholder="Enter course code"
                                    onChange={(event) => {
                                        setLevelCourseCodes[index](event.target.value);
                                    }}
                                    value={levelCourseCodes[index]} />
                            </Form.Group>

                            <Form.Group className='mb-1' >
                                <Form.Label>
                                    Course Title
                                </Form.Label>
                                <Form.Control type='text' placeholder="Enter course title"
                                    onChange={(event) => {
                                        setLevelTitles[index](event.target.value);
                                    }}
                                    value={levelTitles[index]} />
                            </Form.Group>

                            <Form.Group className='mb-3' >
                                <Form.Label>
                                    Number of candidates
                                </Form.Label>
                                <Form.Control type='number' placeholder="How many students?"
                                    onChange={(event) => {
                                        setLevelPopulation[index](event.target.value);
                                    }}
                                    value={levelPopulations[index]} />
                            </Form.Group>

                            <Form.Group className='mb-2'>

                                <Button variant='dark' className='mb-3' onClick={() => { setShowLevelSemesters[index](!showLevelSemesters[index]) }} >
                                    <Container >
                                        <Row>
                                            {'Select Semester: ' + levelSemesters[index] + ((levelSemesters[index].length) ? ' semester' : '')}
                                            <Col >
                                                <DropdownButton show={false} onClick={() => { setShowLevelSemesters[index](!showLevelSemesters[index]) }} />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Button>
                            </Form.Group>


                            <Modal show={showLevelSemesters[index]} centered size="sm" className="text-center">
                                <ModalBody>

                                    <Card>
                                        <Button onClick={() => {
                                            setLevelSemester[index]('1st');
                                            setShowLevelSemesters[index](false)
                                        }}>
                                            1st Semester
                                        </Button>
                                    </Card>

                                    <Card>
                                        <Button onClick={() => {
                                            setLevelSemester[index]('2nd');
                                            setShowLevelSemesters[index](false)
                                        }}>
                                            2nd Semester
                                        </Button>
                                    </Card>

                                </ModalBody>
                            </Modal>

                        </Form>


                        <Row>
                            <Col>
                                <Button variant='primary' onClick={() => {
                                    if (levelCourseCodes[index].length &&
                                        levelTitles[index].length &&
                                        levelPopulations[index] &&
                                        levelSemesters[index].length) {
                                        setLevelData[index]([...levelData[index], {
                                            'courseCode': levelCourseCodes[index],
                                            'title': levelTitles[index],
                                            'level': levels[index],
                                            'population': levelPopulations[index],
                                            'semester': levelSemesters[index],
                                        }]);
                                        setLevelCourseCodes[index]('');
                                        setLevelTitles[index]('');
                                        setLevelPopulation[index](0);
                                        setLevelSemester[index]('');
                                    }
                                }}>
                                    Add
                                </Button>
                            </Col>

                        </Row>
                        {(levelData[index].length) ?
                            buildDataList([...levelData[index]], setLevelData[index]) :
                            null}
                    </Container>
                </Container>
            );
        });

    }

    return (
        <Container className='bg-danger text-light pb-3'>

            <Container className='p-3 bg-dark text-light'>
                <h3>
                    Add Courses
                </h3>
            </Container>

            <Alert show={showBanner} variant={(showBanner === 1) ?
                'success' : 'danger'}>{bannerText[showBanner]}</Alert>

            {buildForm()}


            <Button variant='primary' type='submit' onClick={formProcessor}>
                Finish & Submit
            </Button>


            <Modal show={showModal} centered size="sm" className="text-center">
                <ModalBody>
                    <Card>
                        Courses added
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

export default AddCourses;