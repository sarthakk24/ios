const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
// Function to fetch data from the Google Books API
async function fetchData(category) {
  const apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  const queryParams = {
    q: `subject:${category}`,
    filter: 'full',
    maxResults: 40,
    printType: 'books',
    langRestrict: 'en',
    orderBy: 'relevance',
    key: 'AIzaSyCg9g67z1ty_tGRNrBkBIgsQwCyoiHbs80', // Replace 'YOUR_API_KEY' with your actual API key
  };

  try {
    const response = await axios.get(apiUrl, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

function generateRandomNumber() {
  // Generate a random number between 20 and 35 (inclusive) with one decimal place
  const randomNumber = (Math.floor(Math.random() * 16) + 20) / 10;
  return randomNumber;
}

// Function to format and save data to JSON file
function saveToJson(data, category) {
  if (!data || !data.items || data.items.length === 0) {
    console.error('No data to save.');
    return;
  }

  const arr = [];

  data.items.forEach((item, index) => {
    if (!item.volumeInfo.industryIdentifiers) {
      return;
    }

    if (!item.volumeInfo.authors) {
      return;
    }
    console.log(`Book ${index + 1}:`, item.volumeInfo.title);

    const book = item.volumeInfo;
    const bookCount = Math.floor(Math.random() * 8) + 3;

    const formattedDate = moment(book.publishedDate).format('D/M/YYYY, h:mm A');
    const bookRating = book.averageRating || generateRandomNumber();
    let link = Object.values(book.imageLinks)[0];

    if (link.startsWith('http://')) {
      link = link.replace('http://', 'https://');
    }

    const formattedData = {
      bookName: book.title || 'Unknown Title',
      bookAuthor: book.authors[0] || [],
      bookCategory: category,
      bookPublishingDate: formattedDate || 'Unknown Date',
      bookDescription: book.description || 'No description available',
      bookRating,
      bookImageURL: link,
      bookISBN: book.industryIdentifiers[0].identifier || 'Unknown ISBN',
      bookCount,
      bookAvailableCount: bookCount,
      bookSubCategories: [],
      bookPreBookedCount: 0,
      bookStatus: 'Available',
      bookTakenCount: 0,
      bookReviews: ['Good Book', 'Nice Book', 'Awesome Book', 'Great Book'],
      bookIssuedTo: [],
      bookIssuedOn: [],
      bookIssuedToName: [],
      bookExpectedReturnOn: [],
      bookHistory: [],
    };

    arr.push(formattedData);
  });

  const jsonFilePath = './book_data.json';

  fs.writeFile(jsonFilePath, JSON.stringify(arr, null, 2), (err) => {
    if (err) {
      console.error('Error writing to JSON file:', err);
      return;
    }
    console.log('Data saved to book_data.json');
  });
}

// Main function to orchestrate fetching and saving data
async function main() {
  const category = 'Fiction';
  const responseData = await fetchData(category);
  saveToJson(responseData, category);
}

// Execute main function
main();
