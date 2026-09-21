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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Check if ID is numeric or slug
    let posts;
    if (!isNaN(Number(id))) {
      posts = await query('SELECT * FROM posts WHERE id = ?', [id]);
    } else {
      posts = await query('SELECT * FROM posts WHERE slug = ?', [id]);
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: 'Postagem não encontrada.' }, { status: 404 });
    }

    const post = posts[0];
    
    // Increment view counter asynchronously
    query('UPDATE posts SET views = views + 1 WHERE id = ?', [post.id]).catch(() => {});

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Erro ao buscar post por ID/slug:', error);
    return NextResponse.json({ error: 'Erro ao carregar postagem.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const { title, slug: reqSlug, summary, content, category, image_url, video_url, video_type, published, featured } = await request.json();

    let slug = reqSlug ? slugify(reqSlug) : slugify(title);
    
    // Check if the new slug already exists for another post
    const existing = await query('SELECT id FROM posts WHERE slug = ? AND id != ?', [slug, id]);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    await query(
      `UPDATE posts SET title = ?, slug = ?, summary = ?, content = ?, category = ?, image_url = ?, video_url = ?, video_type = ?, published = ?, featured = ?
       WHERE id = ?`,
      [title, slug, summary, content, category, image_url, video_url, video_type || 'youtube', published !== undefined ? published : 1, featured ? 1 : 0, id]
    );

    return NextResponse.json({ success: true, message: 'Post atualizado com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao atualizar post:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a postagem.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    await query('DELETE FROM posts WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Post excluído com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao excluir post:', error);
    return NextResponse.json({ error: 'Erro ao excluir a postagem.' }, { status: 500 });
  }
}
