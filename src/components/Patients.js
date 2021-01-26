import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { Container, Table, Col, Row, Button } from "react-bootstrap";
import firebase from "firebase/app";

const Patients = (props) => {
  const user = props.location.user;

  const [value, loading, error] = useCollection(
    firebase.firestore().collection("Therapists").doc(user.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [patients, setPatients] = useState();

  useEffect(() => {
    if (value) {
      const res = value.data().all_patients;
      let pats = [];
      res.forEach((e) => {
        firestore
          .collection("Patients")
          .doc(e)
          .get()
          .then((doc) => {
            if (doc.exists) pats.push(doc.data().name);
          });
      });
      setPatients(pats);
    }
  }, [value]);

  return (
    <Container className="list row">
      <Container className="col-md-6">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>All Patients</th>
            </tr>
          </thead>
          <tbody>
            {patients
              ? patients.forEach((e) => {
                  return (
                    <tr>
                      <td>{e}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
      </Container>
      <Container className="col-md-8 col-lg-8"></Container>
    </Container>
  );
};

export default Patients;
