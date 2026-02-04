import { movieDbFetch } from './_utils/movieDb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { search } = req.body;

  try {
    const data = await movieDbFetch('/search/movie', { query: search });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}