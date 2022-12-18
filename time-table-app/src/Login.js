import { Form, Button, Container, Alert, Spinner, Row, Col, Modal, ModalBody, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sharedVariables } from './sharedVariables';
//import { Navigate } from 'react-router-dom';


function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentView, setCurrentView] = useState(0);
    const [showBanner, setBanner] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [blockView, setBlockView] = useState(false);
    const bannerText = ["", "Success...Logged in", "Invalid Login Data",
        "A user is already logged in", "Unknown error occurred"];

    const navigate = useNavigate();
    const users = { admin: '/administrator', student: '/student' };
    const location = useLocation();
    const url = sharedVariables.url;
    //  const selectedDesignation = props.selectedDesignation;
    //   console.log('login', selectedDesignation);

    const backgroundImg = 'optoPic.png';

    const formProcessor = (event) => {
        event.preventDefault();
        if (username && password) {
            setBlockView(true);
            fetch(`${url}/login`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    'username': username,
                    'password': password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then((response) => {
                response.json().then((body) => {
                    if (response.status !== 200) {
                        //failed
                        setBlockView(false);
                        setBanner(4);
                    }
                    else if (body.respCode === 0) {
                        //unknown error
                        setBlockView(false);
                        setBanner(4);
                        //show custom error page
                        return
                    }
                    else if (body.respCode === 1) {
                        //login successful
                        console.log(body);
                        const user = body.user;
                        setBanner(1);
                        setBlockView(false);
                        navigate(users[user],
                            { replace: true, state: { requiredData: body.data } });
                        // <Entry />
                    }
                    else if (body.respCode === 2) {
                        //invalid login
                        setBlockView(false);
                        setBanner(2);
                        //show custom error page
                        return
                    }
                    else {
                        //already logged in
                        setBlockView(false);
                        setBanner(3);
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
        <Container className='has-bg-img'>

            {/*   <Container className='text-center bg-black'>
                <img src={backgroundImg} height="200px" alt='logo' className=" bg-img mb-3" />
            </Container>
 */}
            <h1 className='text-center'>Login</h1>

            <Alert show={showBanner} variant={(showBanner === 1) ? 'success' : 'danger'}>{bannerText[showBanner]}</Alert>

            <Form onSubmit={formProcessor}>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        matric number
                    </Form.Label>

                    <Form.Control type='username' placeholder='Enter your matric number'
                        onChange={(event) => { setBanner(0); setUsername(event.target.value) }} value={username} />

                </Form.Group>

                <Form.Group className='mb-3'>

                    <Form.Label>
                        Password
                    </Form.Label>

                    <Form.Control type="password" placeholder='Enter password'
                        onChange={(event) => { setBanner(0); setPassword(event.target.value) }} value={password} />
                </Form.Group>

                <Row>
                    <Col>
                        <Button variant='primary' type='submit' >
                            Login
                        </Button>
                    </Col>
                    <Col>
                        <Button variant='primary' onClick={() => {
                            navigate('/createAccount',
                                { replace: false });
                        }}>
                            Create Account
                        </Button>
                    </Col>
                </Row>


            </Form>

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

    const Views = [defaultView];
    return Views[currentView]
}
export default Login;