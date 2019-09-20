// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firestore.
const admin = require('firebase-admin');
const serviceAccount = require("./face-rec-v1-1dbe34b3f394.json");
// const nodemailer = require('nodemailer');
// const cors = require('cors')({origin: true});
const dotenv = require('dotenv').config;

// const SENDGRID_API_KEY = functions.config().sendgrid.key;
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(SENDGRID_API_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://face-rec-v1.firebaseio.com",
});


// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD
//   }
// });


exports.createNewUserPostAuth = functions.auth.user().onCreate(function(user, context) {
	const uid = user.uid;
	const displayName = user.displayName;
	const email = user.email;
	const photoURL = user.photoURL;
	// const providerId = user.providerId;
	const phoneNumber = user.phoneNumber;
	const currentDateTime = new Date().getTime();


	const userExists = admin.firestore().collection('users').doc(uid).get().then(function(doc) {
  	if (!doc.exists) {
  		admin.firestore().collection('users').doc(uid).set({
  			displayName: displayName,
  			email: email,
  			photoURL: photoURL,
  			phoneNumber: phoneNumber,
  			creationDate: currentDateTime
  		});
  	}
  });
  return userExists;
});