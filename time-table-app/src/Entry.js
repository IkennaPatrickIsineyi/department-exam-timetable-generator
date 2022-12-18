import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import { sharedVariables } from "./sharedVariables";

function Entry() {
    const [payLoad, setPayLoad] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    //const selectedDesignation = (location.state == null) ? null : location.state.selectedDesignation;
    const url = sharedVariables.url;
    const designation = Cookie.get('username');
    const users = ['/administrator', '/student'];


    const callEntry = (callback) => {
        console.log('callEntry ', designation);
        //if (designation === selectedDesignation || designation === undefined || designation === null) {
        fetch(`${url}/entry`, {
            method: 'get',
            credentials: 'include'
        }).then(response => {
            response.json().then((body) => {
                console.log('responded...');
                if (response.status !== 200) {
                    throw Error(body.message);
                }
                else if (body.respCode === 0) {
                    //error occurred
                    console.log('error occurred');
                }
                else {
                    //no issue server issues
                    console.log()
                    console.log("success...");
                    callback(body);
                }

            });
        });
        //  }
        /*    else {
               callback({ respCode: 2 });
           } */
    };

    useEffect(() => {
        callEntry(setPayLoad);
    }, []);


    return (
        /* o ... nno reply yet 
        1... not logged in
        2... logged in*/
        <>
            <Container>{(Object.values(payLoad).length === 0) ?
                <Spinner animation="border" /> :
                (payLoad.respCode === 2) ?
                    <Login /> :
                    navigate((designation === 'admin') ? users[0] : users[1], { replace: true, state: { requiredData: payLoad.data } })
                //loaded.user is a number index of user type.
            }
            </Container>
        </>

    );
}

export default Entry;