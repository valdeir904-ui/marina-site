import { query } from './src/lib/db';

async function updateBlogCovers() {
  await query("UPDATE posts SET image_url = '/images/blog-ansiedade.png' WHERE id = 4;");
  await query("UPDATE posts SET image_url = '/images/blog-ansiedade.png' WHERE id = 2;");
  await query("UPDATE posts SET image_url = '/images/blog-relacionamentos.png' WHERE id = 6;");
  const posts = await query('SELECT id, title, image_url FROM posts;');
  console.log(posts);
}

updateBlogCovers();
