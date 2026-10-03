import { query } from './src/lib/db';

async function check() {
  const posts = await query('SELECT id, title, featured, published FROM posts;');
  console.log(posts);
}
check();
