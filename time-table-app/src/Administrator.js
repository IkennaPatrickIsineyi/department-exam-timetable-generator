import { Col, Container, Row, Image, Modal, ModalBody, CardGroup, Card, Button } from "react-bootstrap";
import { sharedVariables } from './sharedVariables';
/* import passport from './passport.jpg'; */
/* import AddStaff from './AddStaff';
import AddSupplier from './AddSupplier';
import AddStock from './AddStock';
import FindStaff from './FindStaff';
import FindSupplier from './FindSupplier';
import CreateStock from './CreateStock';
import SetSupplier from './SetSupplier'; */
import addStaffImg from './icons8-add-user-55.png';
import addSupplierImg from './icons8-supplier-100.png';
import addStockImg from './icons8-add-new-100.png';
import setSupplierImg from './icons8-signing-a-document-50.png';
import findStaffImg from './icons8-find-user-male-50.png';
import findSupplierImg from './icons8-file-100.png';
import createStockImg from './icons8-document-64.png';


import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Admin() {

    /*  const addStaffImg = 'icons8-add-user-55.png';
     const addSupplierImg = 'icons8-supplier-100.png';
     const addStockImg = 'icons8-add-new-100.png';
     const setSupplierImg = 'icons8-signing-a-document-50.png';
     const findStaffImg = 'icons8-find-user-male-50.png';
     const findSupplierImg = 'icons8-file-100.png';
     const createStockImg = 'icons8-document-64.png'; */


    //const passport = 'passport.jpg';
    const [showTableModal, setShowTableModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const url = sharedVariables.url;

    const formProcessor = (event) => {
        event.preventDefault();

        const formData = new FormData();

        fetch(url + '/getSemesters', {
            method: 'GET',
            credentials: 'include',
            // body: formData
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

                    if (body.data.length)
                        navigate('/findTimeTable',
                            {
                                state: { requiredData: body.data }
                            });

                    else
                        setShowTableModal(true);

                    // setBlockView(false);

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

    const getCourses = (event) => {
        event.preventDefault();

        const formData = new FormData();

        fetch(url + '/getCourses', {
            method: 'GET',
            credentials: 'include',
            // body: formData
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
                    if (body.data.length)
                        navigate('/viewCourses',
                            {
                                state: { courses: body.data }
                            });
                    else
                        // setBlockView(false);
                        setShowModal(true);
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

    return (<Container className="p-4 bg-danger">
        <Row className="p-2 ">
            <Col className="p-5 bg-primary text-center text-light rounded mx-1"
                onClick={() => { navigate('/addCourses'); }}>
                <Image src={addStockImg} fluid width="100px" />
                <h3>
                    Add Courses
                </h3>
            </Col>
            <Col className="p-5 bg-secondary text-center text-light rounded mx-1"
                onClick={() => { navigate('/createTimeTable'); }}>
                <Image src={addStockImg} fluid width="100px" />
                <h3>
                    Create timetable
                </h3>
            </Col>
            <Col className="p-5 bg-white text-center text-dark rounded mx-1"
                onClick={formProcessor}>
                <Image src={addStockImg} fluid width="100px" />
                <h3>
                    View timetable
                </h3>
            </Col>
            <Col className="p-5 bg-white text-center text-dark rounded mx-1"
                onClick={getCourses}>
                <Image src={addStockImg} fluid width="100px" />
                <h3>
                    View Courses
                </h3>
            </Col>
        </Row>

        <Modal show={showModal} centered size="sm" className="text-center">
            <ModalBody>
                <Card>
                    No courses... Use Add Courses to add courses
                    <Button onClick={() => { setShowModal(false); }}>
                        Dismiss
                    </Button>
                </Card>
            </ModalBody>
        </Modal>

        <Modal show={showTableModal} centered size="sm" className="text-center">
            <ModalBody>
                <Card>
                    No timetable
                    <Button onClick={() => { setShowTableModal(false); }}>
                        Dismiss
                    </Button>
                </Card>
            </ModalBody>
        </Modal>

    </Container >);


    /*   const Views = [defaultView]
  
      return Views[0]; */

}

export default Admin;