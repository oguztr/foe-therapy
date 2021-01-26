import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Container, Image, Col, Row, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { button } from "../Styles";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection("Therapists")
          .doc(user.uid)
          .get()
          .then((doc) => {
            setUserInfo(doc.data());
          });
      }
    });
  }, []);

  return (
    <Container className="center mt-5">
      {userInfo ? (
        <>
          <Row>
            <Col>
              <Image
                src={userInfo.photoUrl}
                style={{ height: "100px", width: "100px" }}
                roundedCircle
              />
            </Col>
            <Col>
              <h4>{userInfo.name} </h4>
              <h5>{userInfo.specialist}</h5>
            </Col>
            <Col>
              <Link
                to={{
                  pathname: "/update",
                  user: userInfo,
                }}
                className="btn"
                style={button}
              >
                Update profile
              </Link>
            </Col>
            <Col>
              <h5>Score: {userInfo.score}</h5>
            </Col>
          </Row>

          <Row className="mt-5">{userInfo.about}</Row>
          <Row>{userInfo.Name}</Row>

          <Row className="mt-5">
            <Col>
              <h5>Expertises</h5>
              {userInfo.expertise.map((data, index) => {
                return <p>{data}</p>;
              })}
            </Col>
            <Col>
              <h5>Educations</h5>
              {userInfo.education.map((data, index) => {
                return <p>{data}</p>;
              })}
            </Col>
            <Col>
              <h5>Certificacetes</h5>
              {userInfo.certificates.map((data, index) => {
                return data.date + " " + data.institution + " " + data.title;
              })}
            </Col>
          </Row>
          <h3>Comments</h3>
          <Container fluid className="mt-5">
            {userInfo
              ? userInfo.comments.map((data) => {
                  return (
                    <Card className="mt-3">
                      <Card.Header style={{ backgroundColor: "#7FFFD4" }}>
                        @{data.nick}
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>{data.body}</Card.Text>
                      </Card.Body>
                    </Card>
                  );
                })
              : null}
          </Container>
        </>
      ) : null}
    </Container>
  );
};

export default Profile;

/*
  <Row>
            <Col className="mt-5">
              <Link
                to={{
                  pathname: "/patients",
                  user,
                }}
                className="btn"
                style={button}
              >
                Old Patients
              </Link>
            </Col>
          </Row>
*/
