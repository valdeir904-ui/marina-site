import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const all = searchParams.get('all') === 'true';

    let sql = 'SELECT * FROM posts';
    const params: any[] = [];

    // Se 'all=true' foi passado, verifica se é admin. Se for admin, não filtra por published = 1.
    let showAll = false;
    if (all) {
      const user = await getSessionUser();
      if (user) showAll = true;
    }

    if (!showAll) {
      sql += ' WHERE published = 1';
    } else {
      sql += ' WHERE 1=1'; // placeholder to easily append AND clauses
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const posts = await query(sql, params);
    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json({ error: 'Erro ao buscar postagens.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { title, slug: reqSlug, summary, content, category, image_url, video_url, video_type, featured, published } = await request.json();

    if (!title || !content || !summary) {
      return NextResponse.json({ error: 'Título, resumo e conteúdo são obrigatórios.' }, { status: 400 });
    }

    let slug = reqSlug ? slugify(reqSlug) : slugify(title);
    const existing = await query('SELECT id FROM posts WHERE slug = ?', [slug]);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const result = await query(
      `INSERT INTO posts (title, slug, summary, content, category, image_url, video_url, video_type, published, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, summary, content, category || 'Artigos', image_url || '', video_url || '', video_type || 'youtube', published !== undefined ? published : 1, featured ? 1 : 0]
    );

    return NextResponse.json({ success: true, id: result.insertId, slug });
  } catch (error: any) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json({ error: 'Erro ao salvar a postagem.' }, { status: 500 });
  }
}
