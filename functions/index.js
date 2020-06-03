const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  // for background triggers you must return a value/promise
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    upvotedOn: [],
  });
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  // for background triggers you must return a value/promise
  const userRef = admin.firestore().collection('users').doc(user.uid);
  return userRef.delete();
});

exports.addRequest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add requests'
    );
  }
  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'request must be no more than 30 characters long'
    );
  }
  return admin.firestore().collection('requests').add({
    text: data.text,
    upvotes: 0,
  });
});

exports.upvote = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can Upvote'
    );
  }
  const user = admin.firestore().collection('users').doc(context.auth.uid);
  const request = admin.firestore().collection('requests').doc(data.id);

  const document = await user.get();
  // Chech user hasn't upvoted to the Request
  if (document.data().upvotedOn.includes(data.id)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'users cant Upvote more than once'
    );
  }
  // Update User Array
  await user.update({
    upvotedOn: [...document.data().upvotedOn, data.id],
  });
  // Update the Request Upvotes
  return request.update({
    upvotes: admin.firestore.FieldValue.increment(1),
  });
});

// Firestore trigger for Tracking Activity
exports.logActivity = functions.firestore
  .document('/{collection}/{id}')
  .onCreate((snapShot, context) => {
    console.log(snapShot.data());

    const collection = context.params.collection;
    const id = context.params.id;
    const activities = admin.firestore().collection('activities');

    collection === 'requests' &&
      activities.add({ text: 'A New Tutorial Request was just added!' });
    collection === 'users' &&
      activities.add({ text: 'A New User was just signed up!' });

    return null;
  });
