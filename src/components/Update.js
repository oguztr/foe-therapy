import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase";
import { useFormik } from "formik";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useHistory } from "react-router-dom";
const Update = () => {
  const [user, setUser] = useState({});
  const [certificates, setCertificates] = useState([]);
  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection("Therapists")
          .doc(user.uid)
          .get()
          .then((doc) => {
            setUser(doc.data());
            setCertificates(doc.data().certificates);
          });
      }
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      about: "",
      phone: "",
      specialist: "",
      education: "",
      expertise: "",
      age: 0,
    },
    onSubmit: (values) => {
      const ref = firestore.collection("Therapists").doc(user.tid);
      const update = {};
      if (values.name.trim() != "") update.name = values.name;
      if (values.about.trim() != "") update.about = values.about;
      if (values.phone.trim() != "") update.phone = values.phone;
      if (values.specialist.trim() != "") update.specialist = values.specialist;
      if (values.education.trim() != "")
        update.education = values.education.split(",");
      if (values.expertise.trim() != "")
        update.expertise = values.expertise.split(",");
      if (values.age != 0) update.age = 2021 - values.age;

      ref.update(update).then(() => {
        history.goBack();
      });
    },
  });

  return (
    <Container fluid className="justify-content-md-center">
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.name}
                name="name"
                placeholder={user ? user.name : null}
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
                placeholder={user ? user.specialist : ""}
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
                placeholder={user ? user.education : ""}
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
                placeholder={
                  user ? user.expertise : "Your expertises seperate with ,"
                }
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
                placeholder={user ? 2021 - user.age : "Date"}
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
                placeholder={user ? user.phone : "Your phone number"}
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
                placeholder={user ? user.about : ""}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form.Group>
              <Form.Label>Certificates</Form.Label>
              <Col className="ml-auto">
                <Button
                  onClick={() => {
                    certificates.push({ title: "", institution: "", date: "" });
                    setCertificates(certificates);
                  }}
                >
                  <BsPlus />
                </Button>
              </Col>
              {certificates
                ? certificates.map((cer) => {
                    return (
                      <Form.Row>
                        <Col>
                          <Form.Control placeholder="institution" />
                        </Col>
                        <Col>
                          <Form.Control placeholder="title" />
                        </Col>
                        <Col>
                          <Form.Control placeholder="date" />
                        </Col>
                      </Form.Row>
                    );
                  })
                : null}
            </Form.Group>
          </Col>
        </Row>

        <Col md={{ span: 4, offset: 4 }}>
          <Button variant="primary" type="submit">
            Update Profile
          </Button>
        </Col>
      </Form>
    </Container>
  );
};

export default Update;
