import "../App.css";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { firestore, auth, storage } from "../firebase";
import { useFormik } from "formik";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "../App.css";
import { button } from "../Styles";
import { FaPaperPlane } from "react-icons/fa";
import { useHistory } from "react-router-dom";
const Chat = () => {
  const [user] = useAuthState(auth);
  const [patients, setPatients] = useState();
  const [pid, setPid] = useState(null);
  const [photoUrl, setPhoto] = useState();
  const history = useHistory();
  const getPatients = async () => {
    const id = auth.currentUser.uid;

    firestore
      .collection("Patients")
      .where("current_t", "==", id)
      .onSnapshot((res) => {
        const patients = [];
        res.forEach((child) => {
          var id = child.id;
          var data = child.data();
          patients.push({ id, name: data.name, data });
        });
        setPatients(patients);
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await getPatients();
      }
    });
  }, []);

  return (
    <Container fluid className="pt-5 ml-2">
      <Row className="rounded-lg overflow-hidden shadow">
        <div className="col-2 px-0">
          <div className="bg-white">
            <div className="bg-gray px-4 bg-light">
              <p className="h5 mb-0 ">Recent</p>
            </div>

            <div className="messages-box">
              <div className="list-group rounded-0">
                {patients &&
                  patients.map((patient, index) => {
                    {
                      storage
                        .ref("images")
                        .child(patient.id)
                        .getDownloadURL()
                        .then((url) => setPhoto(url));
                    }
                    return (
                      <a
                        class="list-group-item list-group-item-action active text-white rounded-0"
                        onClick={() => {
                          setPid(patient.id);
                        }}
                      >
                        <div class="media">
                          <img
                            src={photoUrl || null}
                            alt="user"
                            width="50"
                            class="rounded-circle"
                          />
                          <div class="media-body ml-4">
                            <div class="d-flex align-items-center justify-content-between mb-1">
                              <h6 class="mb-0"> {patient.name} </h6>
                              <small class="small font-weight-bold">
                                25 Dec
                              </small>
                            </div>
                            <p class="font-italic mb-0 text-small"></p>
                            <Row>
                              <Col>
                                <Button
                                  as={Link}
                                  to={{ pathname: "/results", id: patient.id }}
                                >
                                  Test Results
                                </Button>
                              </Col>
                              <Col>
                                <Button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Would you like to end session?"
                                      )
                                    ) {
                                      firestore
                                        .collection("Chat")
                                        .doc(patient.id)
                                        .update({ active: false });

                                      firestore
                                        .collection("Patients")
                                        .doc(patient.id)
                                        .update({
                                          current_t: "",
                                          current_chatid: "",
                                          chat_sessions_count: firebase.firestore.FieldValue.increment(
                                            1
                                          ),
                                        });

                                      const tRef = firestore
                                        .collection("Therapists")
                                        .doc(user.uid);
                                      tRef.get().then((doc) => {
                                        var patients = doc
                                          .data()
                                          .patients.filter(
                                            (e) => e != patient.id
                                          );
                                        tRef.update({ patients });
                                      });
                                      history.push("/");
                                    }
                                  }}
                                >
                                  End Session
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {pid ? <ChatRoom id={pid} /> : null}
      </Row>
    </Container>
  );
};
function ChatRoom({ id }) {
  const [chat, setChat] = useState();
  const [chatAll, setChatAll] = useState();
  const [messages, setMessages] = useState();
  const [notes, setNotes] = useState();
  const [addNote, setAddNote] = useState();
  let chatRef = firestore.collection("Chat");
  const [photoUrl, setPhoto] = useState();
  const [myphotoUrl, setPhotoMy] = useState();

  useEffect(() => {
    chatRef.doc(id).onSnapshot((doc) => {
      setChat(doc.id);
      setMessages(doc.data().messages);
      setNotes(doc.data().notes);
      setChatAll(doc.data());
    });
    storage
      .ref("images")
      .child(id)
      .getDownloadURL()
      .then((url) => setPhoto(url));
  }, []);

  const formik = useFormik({
    initialValues: {
      text: "",
      note: "",
    },
    onSubmit: ({ text }) => {
      chatRef.doc(chat).update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          body: text,
          date: firebase.firestore.Timestamp.now(),
          patient: false,
        }),
      });
      formik.values.text = "";
    },
  });
  const handleNote = (event) => {
    event.preventDefault();
    let n_notes = [...notes, { note: formik.values.note, importance: 5 }];
    formik.values.note = "";
    chatRef.doc(chat).update({
      notes: n_notes,
    });
  };
  const patMes = (body, date) => {
    return (
      <div className="media w-50 mt-3 px-4">
        <img src={photoUrl} alt="user" width="35" class="rounded-circle" />
        <div className="media-body ml-3">
          <div className="bg-light rounded py-2 px-3 mb-2">
            <p className="text-small mb-0 text-muted">{body}</p>
          </div>
          <p className="small text-muted">
            {new Date(
              date.seconds * 1000 + date.nanoseconds / 1000000
            ).toLocaleTimeString("tr-TR")}
          </p>
        </div>
      </div>
    );
  };

  const theMes = (body, date) => {
    return (
      <div className="media w-50 ml-auto mt-3 px-4 ">
        <div class="media-body">
          <div class="bg-primary rounded py-2 px-3 mb-2">
            <p class="text-small mb-0 text-white">{body}</p>
          </div>
          <p class="small text-muted">
            {new Date(
              date.seconds * 1000 + date.nanoseconds / 1000000
            ).toLocaleTimeString("tr-TR")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="col-6 px-0">
        <div className=" chat-box bg-white">
          {messages &&
            messages.map((data, index) => {
              return data.patient
                ? patMes(data.body, data.date)
                : theMes(data.body, data.date);
            })}
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="bg-light form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Type a message"
                  name="text"
                  value={formik.values.text}
                  onChange={formik.handleChange}
                  aria-describedby="button-addon2"
                  className="form-control rounded-0 border-0 mt-2  bg-light "
                />
                <div className="input-group-append">
                  <button
                    id="button-addon2"
                    type="submit"
                    className="btn btn-link"
                  >
                    <i>
                      <FaPaperPlane />
                    </i>
                  </button>
                </div>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
      <div className="col-4 px-0">
        <div className="chat-box bg-white">
          {notes
            ? notes.map((data, index) => {
                return (
                  <div className="media border-bottom border-left px-1 mb-2">
                    <p>{data.note}</p>
                  </div>
                );
              })
            : null}
          <Form onSubmit={handleNote}>
            <Form.Group className="bg-light form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Type a note"
                  onChange={formik.handleChange}
                  value={formik.values.note}
                  name="note"
                  aria-describedby="button-addon2"
                  className="form-control rounded-0 border-0 py-4 bg-light "
                />
                <div className="input-group-append">
                  <button
                    id="button-addon2"
                    type="submit"
                    className="btn btn-link"
                  >
                    <i>
                      <FaPaperPlane />
                    </i>
                  </button>
                </div>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Chat;

/*  <div className="chat-box">
        <Col className="ml-5 border">
          {notes
            ? notes.map((data, index) => {
                return (
                  <Row>
                    <p>{data.note}</p>
                  </Row>
                );
              })
            : null}
          <Form
            onSubmit={handleNote}
            style={{ bottom: "0", position: "absolute" }}
          >
            <Row>
              <Col>
                <Form.Group>
                  <Form.Control
                    name="note"
                    onChange={formik.handleChange}
                    value={formik.values.note}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Button variant="primary" type="submit">
                  Add Note
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
  
<Container>
      <Row>
        <Col
          className="col-md-12 col-lg-12 border"
          style={{ minHeight: "80vh" }}
        >
          {messages
            ? messages.map((data, index) => {
                return (
                  <div
                    className={
                      data.patient ? "mr-auto cont" : "ml-auto cont darker"
                    }
                  >
                    {data.patient ? <img src={photoUrl}></img> : null}
                    <p>{data.body}</p>
                  </div>
                );
              })
            : null}
          <Form
            onSubmit={formik.handleSubmit}
            style={{ top: "70vh", position: "absolute" }}
          >
            <Row>
              <Col xl>
                <Form.Group>
                  <Form.Control
                    name="text"
                    onChange={formik.handleChange}
                    value={formik.values.text}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Button variant="primary" type="submit">
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
     
    </Container>

*/
