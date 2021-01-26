import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { firestore, auth, storage } from "../firebase";
import React, { useState } from "react";
import { useFormik } from "formik";
import HomePage from "./HomePage";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const SignUp = () => {
  const [senior, setSenior] = useState("");
  const [gender, setGender] = useState("");
  const [certificates, setCertificates] = useState([]);
  const history = useHistory();
  const [image, setImage] = useState();
  const [Url, setUrl] = useState("");
  /*const signUpWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };*/

  const db = firestore;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      about: "",
      phone: "",
      specialist: "",
      education: "",
      expertise: "",
    },
    onSubmit: (values) => {
      auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((res) => {
          const ref = db.collection("Therapists").doc(res.user.uid);
          const uploadTask = storage.ref(`images/${res.user.uid}`).put(image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.log(error);
            },
            () => {
              storage
                .ref("images")
                .child(res.user.uid)
                .getDownloadURL()
                .then((url) => {
                  ref
                    .set({
                      ...values,
                      tid: res.user.uid,
                      photoUrl: url,
                      score: 0.0,
                      scoreCount: 0,
                      patients: [],
                      senior_id: "",
                      requests: [],
                      comments: [],
                      certificates: [],
                      education: values.education.split(","),
                      age: 2021 - values.age,
                      intern: senior == "Therapist" ? false : true,
                      internId: "",
                      specialist: values.specialist,
                      expertise: values.expertise.split(","),
                      gender,
                    })
                    .then(() => {
                      auth
                        .signInWithEmailAndPassword(
                          values.email,
                          values.password
                        )
                        .then(() => {
                          history.push("/");
                        });
                    });
                });
            }
          );
        });
    },
  });

  return (
    <Container fluid className="justify-content-md-center">
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Type</Form.Label>
              <Form.Control
                name="gender"
                onChange={(event) => {
                  setSenior(event.target.value);
                }}
                as="select"
              >
                <option>Choose one</option>
                <option>Therapist</option>
                <option>Inexperienced</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                name="gender"
                onChange={(event) => {
                  setGender(event.target.value);
                }}
                as="select"
              >
                <option>Choose one</option>
                <option>Male</option>
                <option>Female</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.name}
                name="name"
                placeholder="Name"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Your Profession</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.specialist}
                name="specialist"
                placeholder="Your Profession"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Your Education</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.education}
                name="education"
                placeholder="Your Education. pls seperate with ,"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Your expertises</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.expertise}
                name="expertise"
                placeholder="Your expertises pls seperate with ,"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                name="age"
                placeholder="Date"
                type="number"
                min={1900}
                max={2003}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                type="tel"
                onChange={formik.handleChange}
                value={formik.values.phone}
                placeholder="Phone Number"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Enter email"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>About You</Form.Label>
              <Form.Control
                name="about"
                onChange={formik.handleChange}
                value={formik.values.about}
                placeholder="Express yourself..."
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Col>
        </Row>
        <Col md={{ span: 4, offset: 4 }}>
          <Form.Group>
            <Form.File
              id="photo"
              label="Your photo"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </Form.Group>
        </Col>

        <Col md={{ span: 4, offset: 4 }}>
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Col>
      </Form>
    </Container>
  );
};

export default SignUp;

/*
<Col className="mt-5" md={{ span: 4, offset: 4 }}>
          <Button onClick={signUpWithGoogle}>Sign Up with Google</Button>
        </Col>*/
