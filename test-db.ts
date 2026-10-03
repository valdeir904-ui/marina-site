import { query } from './src/lib/db';

async function check() {
  const posts = await query('SELECT id, title, image_url, category FROM posts;');
  console.log(posts);
}

check();
