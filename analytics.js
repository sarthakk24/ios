// Import Firebase SDK and initialize Firebase app
var admin = require('firebase-admin');
const moment = require('moment');
// Import Firebase SDK and initialize Firebase app

const serviceAccount = require('./library-management-syste-6cc1e-firebase-adminsdk-xak6r-9a682a8905.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
async function fetchUsersAndGenerateAnalytics() {
  try {
    // Initialize array for analytics
    const monthlyMemberCounts = [];

    // Get users collection
    const usersCollection = db.collection('users');

    // Get the past 11 months including the current month
    const pastYearRange = moment().subtract(11, 'months');

    // Iterate over each month of the past 11 months
    for (let month = 0; month < 11; month++) {
      const startOfMonth = pastYearRange
        .clone()
        .startOf('month')
        .add(month, 'months');
      const endOfMonth = startOfMonth.clone().endOf('month');

      // Query users with role 'member' who joined in the current month
      const querySnapshot = await usersCollection
        .where('role', '==', 'member')
        .where('createdOn', '>=', startOfMonth.toDate())
        .where('createdOn', '<=', endOfMonth.toDate())
        .get();

      // Store the count for the month
      monthlyMemberCounts.push({
        month: startOfMonth.format('MMMM'),
        count: querySnapshot.size,
      });
    }

    // Add data for the current month
    const currentMonthStart = moment().startOf('month');
    const currentMonthEnd = moment().endOf('month');

    const currentMonthQuerySnapshot = await usersCollection
      .where('role', '==', 'member')
      .where('createdOn', '>=', currentMonthStart.toDate())
      .where('createdOn', '<=', currentMonthEnd.toDate()) // Adjusted condition here
      .get();

    monthlyMemberCounts.push({
      month: currentMonthStart.format('MMMM'),
      count: currentMonthQuerySnapshot.size,
    });

    const configDocRef = db
      .collection('configuration')
      .doc('HJ9L6mDbi01TJvX3ja7Z');

    // Set or update the 'monthlyMemberCounts' field
    await configDocRef.set(
      { monthlyMembersCount: monthlyMemberCounts },
      { merge: true }
    );

    console.log(
      'Monthly Member Counts for the past 11 months with current month:',
      monthlyMemberCounts
    );

    // Now you can use monthlyMemberCounts array for further processing
  } catch (error) {
    console.error('Error fetching users and generating analytics:', error);
  }
}

fetchUsersAndGenerateAnalytics();
