import { getApps, FirebaseApp, initializeApp } from "firebase/app"

let firebase: FirebaseApp;
if (getApps().length === 0) {
    firebase = initializeApp({
        apiKey: "AIzaSyDAxKue3J4G7Pihd3Ta6oVZWpDPLUE9s8c",
        authDomain: "ristek-tweet.firebaseapp.com",
        projectId: "ristek-tweet",
        storageBucket: "ristek-tweet.appspot.com",
        messagingSenderId: "656916210814",
        appId: "1:656916210814:web:a28aed2f12316406eca42f",
        measurementId: "G-6GFNNQZJEZ"
    })
} else {
    firebase = getApps()[0]
}

export const app = firebase;