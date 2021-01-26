import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Dropdown,
  Form,
  ButtonGroup,
  Button,
  Row,
  Badge,
  Image,
  Col,
} from "react-bootstrap";
import { auth, firestore } from "../firebase";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import Logo from "../assets/logo.png";
import { button } from "../Styles";

const NavBar = () => {
  const history = useHistory();
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const tRef = firestore.collection("Therapists").doc(user.uid);
        tRef.onSnapshot((doc) => {
          if (doc.exists)
            setRequests(doc.data().requests.filter((f) => f.confirmation != 1));
        });
      }
    });
  }, []);

  const handleOnay = (pid) => {};
  return (
    <Navbar collapseOnSelect variant="white">
      <Navbar.Brand>
        <Image
          src={Logo}
          width="40"
          height="40"
          className="d-inline-block align-top"
          alt="logo"
        />
        <b className="ml-2" style={{ top: 5 }}>
          <span style={{ color: "black" }}>FOE </span>
          <span style={{ color: "#7FFFD4" }}>Therapy</span>
        </b>
      </Navbar.Brand>
      <Nav className="ml-auto mr-3">
        <Button as={Link} to="/" style={button}>
          <b>Home Page</b>
        </Button>
        {user ? (
          <Button as={Link} className="ml-2" to="/chat" style={button}>
            <b>Chat</b>
          </Button>
        ) : null}
      </Nav>

      {user && requests && (
        <Dropdown as={ButtonGroup} className="mr-2">
          <Button variant="outline-dark">
            Notifications <Badge variant="light">{requests.length}</Badge>
          </Button>

          <Dropdown.Toggle
            split
            style={{ background: "#7FFFD4" }}
            id="dropdown-split-basic"
          />

          <Dropdown.Menu>
            <Dropdown.Header>Incoming Requests</Dropdown.Header>

            {requests.map((req, index) => {
              return (
                <Dropdown.Item
                  as={Link}
                  to={{ pathname: "/patient", patient: req.r_patient }}
                >
                  <Row>
                    <Col>
                      {req.r_patient.name} <br />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        className="ml-3"
                        style={button}
                        onClick={() => {
                          firestore
                            .collection("Patients")
                            .doc(req.pid)
                            .update({
                              current_t: user.uid,
                              chat_sessions: firebase.firestore.FieldValue.arrayUnion(
                                req.pid
                              ),
                            });

                          firestore
                            .collection("Therapists")
                            .doc(user.uid)
                            .update({
                              patients: firebase.firestore.FieldValue.arrayUnion(
                                req.pid
                              ),
                            });

                          firestore.collection("Chat").doc(req.pid).set({
                            messages: [],
                            active: true,
                            pid: req.pid,
                            tid: user.uid,
                            comment: false,
                            notes: [],
                          });

                          req.confirmation = 1;
                          firestore
                            .collection("Therapists")
                            .doc(user.uid)
                            .update({
                              requests: requests,
                              all_patients: firebase.firestore.FieldValue.arrayUnion(
                                req.pid
                              ),
                            });

                          const pref = firestore
                            .collection("Patients")
                            .doc(req.pid);

                          pref.get().then((doc) => {
                            var reqs = doc.data().requests;
                            reqs.map((r) => {
                              if (r.tid == user.uid) r.confirmation = 1;
                            });
                            pref.update({
                              requests: reqs,
                              current_chatid: req.pid,
                            });
                          });
                        }}
                      >
                        Onayla
                      </Button>
                      <Button className="ml-3" style={button}>
                        Reddet
                      </Button>
                    </Col>
                  </Row>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}
      {user ? (
        <Form inline className="mr-3">
          <Button className="mr-3" to="/profile" as={Link} style={button}>
            <b>My Profile</b>
          </Button>
          <Link
            onClick={() => {
              auth.signOut();
              history.push("/");
            }}
            style={{ color: "#7FFFD4" }}
          >
            <b>Log Out</b>
          </Link>
        </Form>
      ) : (
        <Form inline className="mr-3">
          <Button as={Link} style={button} to="/signIn">
            <b>Sign In</b>
          </Button>
        </Form>
      )}
    </Navbar>
  );
};

export default NavBar;
