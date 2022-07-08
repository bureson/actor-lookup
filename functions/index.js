const fetch = require('node-fetch').default;
const functions = require('firebase-functions');

require('cors')({ origin: true });

const movieApiUrl = 'https://api.themoviedb.org/3';

exports.searchMovie = functions.runWith({ secrets: ['MOVIEDB_API_KEY'] }).https.onCall((data, context) => {
  functions.logger.info('searchMovie', { structuredData: true, search: data.search });
  return fetch(`${movieApiUrl}/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${encodeURIComponent(data.search)}`).then((response) => {
    const jsonResponse = response.json();
    return jsonResponse;
  });
});
