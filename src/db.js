import firebase from 'firebase';
import md5 from "md5";
import emailTemplates from "./emails";

let db;

export const initialise = () => {
    return new Promise(resolve => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyCv81qQ2g1cCiUPALTKz7H3bAzLpi3NxKA",
                authDomain: "kirstyssecretsanta-a8538.firebaseapp.com",
                projectId: 'kirstyssecretsanta-a8538'
            });
            db = firebase.firestore();
            resolve();
        }
        else {
            db = firebase.firestore();
        }
    });
};

export const addToLIst = (aUserName, aEmail) => {
    const hash = md5(aUserName);

    if (aUserName.length) {
        const data = {
            name: aUserName,
            hash: hash,
            buyingFor: false,
            beingBoughtFor: false,
            visited: false,
            email: aEmail,
            sent: false,
            added: firebase.firestore.FieldValue.serverTimestamp()
        };
        return db.collection("users").add(data);
    }
};

export const getAllUsers = () => {
    // if (process.env.NODE_ENV === 'development') {
    //     return fetch('http://localhost:9000/users').then(aResponse => aResponse.json());
    // }
    return db.collection("users").orderBy('added', 'desc').get();
};

export const deleteFromList = aId => {
    return db.collection('users').doc(aId).delete();
};

export const editUser = (aId, aData, aField) => {
    // return new Promise(resolve => resolve());
    return db.collection('users').doc(aId).set({
        [aField]: aData
    }, { merge : true });
};

export const signIn = (aEmail, aPassword) => {
    return firebase.auth().signInWithEmailAndPassword(aEmail, aPassword).catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // ...
    });
};

export const signOut = () => {
    if (firebase.auth().currentUser) {
        return firebase.auth().signOut();
    }
};

export const sendEmail = (aUser, aEmailIndex) => {
    const message = emailTemplates(aUser, aEmailIndex);

    const email = {
        to: aUser.email,
        name: aUser.name,
        message: message
    };

    console.log(email);
    return db.collection('mail').add(email);
};
