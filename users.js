// Import Firebase SDK and initialize Firebase app
var admin = require('firebase-admin');
const axios = require('axios');
const moment = require('moment');
// Import Firebase SDK and initialize Firebase app

const serviceAccount = require('./library-management-syste-6cc1e-firebase-adminsdk-xak6r-9a682a8905.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createUserFromRandomAPI() {
  try {
    // Fetch a random user from the API
    const { data } = await axios.get(
      'https://randomuser.me/api/?nat=rs&?gender=female'
    );
    const user = data.results[0];

    const userInput = '2023-09'; // Example user input
    const userMonth = moment(userInput, 'YYYY-MM');

    // Generate a random day in the entered month
    const randomDay = Math.floor(Math.random() * userMonth.daysInMonth()) + 1;

    // Create the date object
    const generatedDate = moment(userInput).date(randomDay);

    // Create user using Firebase Authentication
    // const uid = 123;
    const { uid } = await admin.auth().createUser({
      email: user.email,
      password: '12345678', // Set a default password for now
      name: `${user.name.first} ${user.name.last}`,
    });

    // Insert user data into Firestore
    const userData = {
      createdOn: admin.firestore.Timestamp.fromDate(generatedDate.toDate()),
      updateOn: admin.firestore.Timestamp.fromDate(generatedDate.toDate()),
      aadhar: '123456789012',
      email: user.email,
      mobile: user.phone,
      password: '',
      name: `${user.name.first} ${user.name.last}`,
      profileImage: user.picture.large,
      role: 'member',
      status: 'approved',
      userID: uid,
      activeFine: 0,
      totalFined: 0,
      penaltiesCount: 0,
    };

    await db.collection('users').doc(uid).set(userData);
    console.log(userData);

    console.log('User created and inserted into Firestore successfully.');
  } catch (error) {
    console.error('Error creating user and inserting into Firestore:', error);
  }
}

async function myFunction() {
  for (let i = 0; i < 10; i++) {
    createUserFromRandomAPI();
    await sleep(1000); // Sleep for 1 second
  }
}

myFunction();
