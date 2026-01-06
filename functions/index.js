const fetch = require('node-fetch').default;
// const functions = require('firebase-functions');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');

require('cors')({ origin: true });

const movieApiUrl = 'https://api.themoviedb.org/3';
const v2Options = {
  secrets: ['MOVIEDB_API_KEY'],
  maxInstances: 5,
  concurrency: 5,
  region: 'us-central1'
};

exports.searchCast = onCall(v2Options, async (request) => {
  const { data /* , auth */ } = request;
  logger.info('searchCast', { search: data.search });

  try {
    const response = await fetch(`${movieApiUrl}/search/person?api_key=${process.env.MOVIEDB_API_KEY}&query=${encodeURIComponent(data.search)}`);
    return await response.json();
  } catch (error) {
    throw new HttpsError('internal', error.message);
  }
});

exports.searchMovie = onCall(v2Options, async (request) => {
  const { data } = request;
  logger.info('searchMovie', { search: data.search });

  try {
    const response = await fetch(`${movieApiUrl}/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${encodeURIComponent(data.search)}`);
    return await response.json();
  } catch (error) {
    throw new HttpsError('internal', 'Failed to fetch from MovieDB');
  }
});

exports.getCastForMovieId = onCall(v2Options, async (request) => {
  const { data } = request;

  try {
    const response = await fetch(`${movieApiUrl}/movie/${data.movieId}/credits?api_key=${process.env.MOVIEDB_API_KEY}`);
    return await response.json();
  } catch (error) {
    throw new HttpsError('internal', 'Failed to fetch credits');
  }
});

exports.getMovieForPersonId = onCall(v2Options, async (request) => {
  const { data } = request;

  try {
    const response = await fetch(`${movieApiUrl}/person/${data.personId}/movie_credits?api_key=${process.env.MOVIEDB_API_KEY}`);
    return await response.json();
  } catch (error) {
    throw new HttpsError('internal', 'Failed to fetch person credits');
  }
});
