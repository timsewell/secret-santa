import firebase from 'firebase';
import md5 from "md5";

let db;

export const initialise = () => {
    return new Promise(resolve => {
        if (!db) {
            firebase.initializeApp({
                apiKey: "AIzaSyCv81qQ2g1cCiUPALTKz7H3bAzLpi3NxKA",
                authDomain: "kirstyssecretsanta-a8538.firebaseapp.com",
                projectId: 'kirstyssecretsanta-a8538'
            }).then(resolve());

            db = firebase.firestore();
        }
    });
};

export const addToLIst = aUserName => {
    const hash = md5(aUserName);

    if (aUserName.length) {
        const data = {
            name: aUserName,
            hash: hash,
            allocated: false,
            visited: false,
        };
        db.collection("users").add(data).then(docRef => console.log(docRef));
    }
};

export const getAllUsers = () => {
    return db.collection("users").get();
};

export const deleteFromList = aId => {
    return db.collection('users').doc(aId).delete();
};

export const editUser = (aId, aAllocated) => {
    return db.collection('users').doc(aId).set({
        allocated: btoa(aAllocated)
    }, { merge : true });
};

export const signIn = (aEmail, aPassword) => {
    firebase.auth().signInWithEmailAndPassword(aEmail, aPassword).catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // ...
    });
};
