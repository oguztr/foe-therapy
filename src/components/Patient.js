import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Card } from "react-bootstrap";
import { storage } from "../firebase";
import firebase from "firebase/app";

const Patient = (props) => {
  const patient = props.location.patient;
  const [image, setImage] = useState("");

  useEffect(() => {
    storage
      .ref("images")
      .child(patient.id)
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      });
  }, []);
  return (
    <Container className="mt-5">
      <div className="p-15">
        <Row className=" gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={image}
                    alt="Photo"
                    className="rounded-circle"
                    width="150"
                  />
                  <div className="mt-3">
                    <h4>{patient.name}</h4>
                    <p className="text-secondary mb-1">{patient.about}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{patient.name}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{patient.email}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{patient.phone}</div>
                </div>
                <hr />

                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Gender</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {patient.gender}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </Container>
  );
};

export default Patient;
