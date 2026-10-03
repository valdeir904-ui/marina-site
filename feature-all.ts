import { query } from './src/lib/db';

async function featureAll() {
  await query("UPDATE posts SET published = 1, featured = 1;");
  const posts = await query('SELECT id, title, featured, published FROM posts;');
  console.log(posts);
}

featureAll();
