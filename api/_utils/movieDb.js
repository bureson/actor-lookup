import fetch from 'node-fetch';

const MOVIE_API_URL = 'https://api.themoviedb.org/3';

export async function movieDbFetch(path, queryParams = {}) {
  const url = new URL(`${MOVIE_API_URL}${path}`);

  url.searchParams.set('api_key', process.env.MOVIEDB_API_KEY);
  Object.entries(queryParams).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('MovieDB request failed');
  }

  return response.json();
}