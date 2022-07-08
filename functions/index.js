const functions = require('firebase-functions');

require('cors')({ origin: true });

exports.testWorld = functions.https.onCall((data, context) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  return { message: `Hello from Firebase to ${data.name}!` };
});
