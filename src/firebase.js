import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

firebase.initializeApp({
  apiKey: "AIzaSyDI1LiIeDjGDAPoCX0tn9XKm-N2RFyaCvs",
  authDomain: "therapy-d1f58.firebaseapp.com",
  projectId: "therapy-d1f58",
  storageBucket: "therapy-d1f58.appspot.com",
  messagingSenderId: "916733230189",
  databaseURL:
    "https://therapy-d1f58-default-rtdb.europe-west1.firebasedatabase.app/",
  appId: "1:916733230189:web:abef86afc4b1a9800f1364",
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
