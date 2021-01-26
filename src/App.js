import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "./components/navbar";
import HomePage from "./components/HomePage";
import { Container } from "react-bootstrap";
import Chat from "./components/Chat";
import { Route, Switch } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Update from "./components/Update";
import Patients from "./components/Patients";
import Patient from "./components/Patient";
import Results from "./components/Results";

export const App = () => {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/chat" component={Chat} />
        <Route path="/signIn" component={SignIn} />
        <Route path="/signUp" component={SignUp} />
        <Route path="/profile" component={Profile} />
        <Route path="/update" component={Update} />
        <Route path="/patients" component={Patients} />
        <Route path="/patient" component={Patient} />
        <Route path="/results" component={Results} />
      </Switch>
    </>
  );
};

export default App;

//<div>{user ? <Chat /> : <SignIn />}</div>;
