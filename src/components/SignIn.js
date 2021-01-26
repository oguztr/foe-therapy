import { Button, Col, Container, Form, Row } from "react-bootstrap";
import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import "../App.css";

const SignIn = () => {
  const auth = firebase.auth();

  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ email, password }) => {
      auth.signInWithEmailAndPassword(email, password).then(() => {
        history.push("/");
      });
    },
  });
  return (
    <Container className="login-container col-md-6">
      <Row>
        <Col className="login-form-1">
          <h3>Login</h3>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                className="form-control"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Your Email *"
              />
            </Form.Group>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Your Password *"
              />
            </div>
            <div className="form-group">
              <input type="submit" className="btnSubmit" value="Login" />
            </div>
            <Row>
              <Col>
                <div className="form-group">
                  <a href="#" className="ForgetPwd">
                    Forget Password?
                  </a>
                </div>
              </Col>
              <Col>
                <Form.Group>
                  <Link to="/signUp" className="ForgetPwd">
                    Sign Up
                  </Link>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
