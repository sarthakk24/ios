// Import Firebase SDK and initialize Firebase app
var admin = require('firebase-admin');
const moment = require('moment');
// Import Firebase SDK and initialize Firebase app

const serviceAccount = require('./library-management-syste-6cc1e-firebase-adminsdk-xak6r-9a682a8905.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function formatDate(date) {
  return moment(date).utcOffset(0).format('YYYY-MM-DD HH:mm:ss Z');
}

// Function to add books to Firestore
async function addBooksToFirestore(books) {
  try {
    // Loop through each book and add it to Firestore
    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      // Add 'id' field with document ID
      book.id = ''; // Initialize id field
      // Add 'createdOn' and 'updatedOn' fields with current timestamp
      const now = admin.firestore.FieldValue.serverTimestamp();
      book.createdOn = formatDate(now);
      book.updatedOn = formatDate(now);

      const docRef = await db.collection('Books').add(book);

      // Update the document with the generated document ID
      await db.collection('Books').doc(docRef.id).update({ id: docRef.id });

      console.log(`Added book ${i + 1}: ${book.bookName}`);
    }
    console.log('Books added to Firestore successfully!');
  } catch (error) {
    console.error('Error adding books to Firestore: ', error);
  }
}

// Read books from JSON file
const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'book_data.json');

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file: ', err);
    return;
  }

  try {
    const books = JSON.parse(data);
    addBooksToFirestore(books);
  } catch (error) {
    console.error('Error parsing JSON data: ', error);
  }
});
