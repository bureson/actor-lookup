const fetch = require('node-fetch').default;
const functions = require('firebase-functions');

require('cors')({ origin: true });

const movieApiUrl = 'https://api.themoviedb.org/3';

exports.searchCast = functions.runWith({ secrets: ['MOVIEDB_API_KEY'] }).https.onCall((data, context) => {
  functions.logger.info('searchCast', { structuredData: true, search: data.search });
  return fetch(`${movieApiUrl}/search/person?api_key=${process.env.MOVIEDB_API_KEY}&query=${encodeURIComponent(data.search)}`).then((response) => {
    return response.json();
  });
});

exports.searchMovie = functions.runWith({ secrets: ['MOVIEDB_API_KEY'] }).https.onCall((data, context) => {
  functions.logger.info('searchMovie', { structuredData: true, search: data.search });
  return fetch(`${movieApiUrl}/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${encodeURIComponent(data.search)}`).then((response) => {
    return response.json();
  });
});

exports.getCastForMovieId = functions.runWith({ secrets: ['MOVIEDB_API_KEY'] }).https.onCall((data, context) => {
  return fetch(`${movieApiUrl}/movie/${data.movieId}/credits?api_key=${process.env.MOVIEDB_API_KEY}`).then((response) => {
    return response.json();
  });
});

exports.getMovieForPersonId = functions.runWith({ secrets: ['MOVIEDB_API_KEY'] }).https.onCall((data, context) => {
  return fetch(`${movieApiUrl}/person/${data.personId}/movie_credits?api_key=${process.env.MOVIEDB_API_KEY}`).then((response) => {
    return response.json();
  });
});
