import { query } from './src/lib/db';

async function revertDb() {
  await query("UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800', featured = 1, published = 1 WHERE id = 1;");
  await query("UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800', featured = 1, published = 1 WHERE id = 2;");
  await query("UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?auto=format&fit=crop&q=80&w=800', featured = 1, published = 1 WHERE id = 3;");
  await query("UPDATE posts SET published = 0, featured = 0 WHERE id = 4;");
  await query("UPDATE posts SET published = 0, featured = 0 WHERE id = 5;");
  await query("UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1470&auto=format&fit=crop', featured = 1, published = 1 WHERE id = 6;");
  
  const posts = await query('SELECT id, title, image_url, featured, published FROM posts;');
  console.log('Posts reverted:');
  console.log(posts);
}

revertDb();
