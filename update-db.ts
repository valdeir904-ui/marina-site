import { query } from './src/lib/db';

async function updateDb() {
  await query("UPDATE posts SET image_url = '/images/burnout.png' WHERE category LIKE '%Burnout%';");
  await query("UPDATE posts SET image_url = '/images/ansiedade.png' WHERE category LIKE '%Ansiedade%';");
  await query("UPDATE posts SET image_url = '/images/luto.png' WHERE category LIKE '%Luto%';");
  await query("UPDATE posts SET image_url = '/images/relacionamentos.png' WHERE category LIKE '%Relacionamentos%';");
  
  const posts = await query('SELECT id, title, image_url, category FROM posts;');
  console.log('Posts updated:');
  console.log(posts);
}

updateDb();
