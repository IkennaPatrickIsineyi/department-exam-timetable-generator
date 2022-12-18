import { Form, Button, Container, Alert, Spinner, Modal, ModalBody, Card, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sharedVariables } from './sharedVariables';

function CreateAccount() {
    const [username, setUsername] = useState('');
    const [level, setLevel] = useState('');
    const [password, setPassword] = useState('');
    const [showLevel, setShowLevel] = useState(false);

    const [showBanner, setBanner] = useState(0);
    const bannerText = ["", "Account created", "Something went wrong...try again",
        "You are not logged in... Login"];
    const alertColors = ["danger", "success", "warning", "secondary"];
    const [showModal, setShowModal] = useState(false);
    const [blockView, setBlockView] = useState(false);

    const navigate = useNavigate();

    const url = sharedVariables.url;

    // addPatient/?firstName=sapa&lastName=papa&birthday=2020/5/10&email=iki@kkfl.klk&phone=99404&address=ollumm street&image=jfjfj.jpg

    const formProcessor = (event) => {
        event.preventDefault();
        if (username && level && password) {
            setBlockView(true);
            const formData = new FormData();
            const content = {
                'username': username, 'level': level,
                'password': password
            };
            console.log(content);
            for (let item in content) {
                console.log(item, content[item]);
                formData.append(item, content[item]);
            }
            console.log(formData);

            fetch(url + '/createAccount', {
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
        else {
            setBanner(2);
            return
        }
    }

    return (
        //  <>
        <Container className='bg-danger text-light pb-3'>
            <Container className='p-3 bg-dark text-light'>
                <h3>
                    Student Registration
                </h3>
            </Container>

            <Alert show={showBanner} variant={alertColors[showBanner]}>{bannerText[showBanner]}</Alert>
            <Form onSubmit={formProcessor}>
                <Form.Group className='mb-3'>
                    <Form.Label>
                        Matriculation number
                    </Form.Label>
                    <Form.Control type='text' placeholder='Enter your matric number'
                        onChange={(event) => {
                            setBanner(0);
                            setUsername(event.target.value)
                        }} value={username} />
                </Form.Group>


                <Form.Group className='mb-3' controlId="formBasicEmail">
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type="password" placeholder='Enter password'
                        onChange={(event) => { setBanner(0); setPassword(event.target.value) }} value={password} />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Button variant='dark' className='mb-3' onClick={() => { setShowLevel(!showLevel) }} >
                        <Container >
                            <Row>
                                {'Select Level: ' + level}
                                <Col >
                                    <DropdownButton show={false} onClick={() => { setShowLevel(!showLevel) }} />
                                </Col>
                            </Row>
                        </Container>
                    </Button>
                </Form.Group>


                <Modal show={showLevel} centered size="sm" className="text-center">
                    <ModalBody>

                        <Card>
                            <Button onClick={() => { setLevel('100'); setShowLevel(false) }}>
                                100 Level
                            </Button>
                        </Card>

                        <Card>
                            <Button onClick={() => { setLevel('200'); setShowLevel(false) }}>
                                200 Level
                            </Button>
                        </Card>

                        <Card>
                            <Button onClick={() => { setLevel('300'); setShowLevel(false) }}>
                                300 Level
                            </Button>
                        </Card>

                        <Card>
                            <Button onClick={() => { setLevel('400'); setShowLevel(false) }}>
                                400 Level
                            </Button>
                        </Card>

                    </ModalBody>
                </Modal>

                <Modal show={showModal} centered size="sm" className="text-center">
                    <ModalBody>
                        <Card>
                            Account created
                            <Button onClick={() => { setShowModal(false); navigate(-1, { replace: true }) }}>
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

                <Button variant='primary' type='submit' >
                    Submit
                </Button>
            </Form>
        </Container >
        //  </>

    );
}

export default CreateAccount;