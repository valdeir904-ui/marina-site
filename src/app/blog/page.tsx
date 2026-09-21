import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import Link from 'next/link';
import { query } from '@/lib/db';
import { BookOpen, Search, ArrowRight, Video } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';

export const metadata = {
  title: 'Blog de Saúde Mental | Dra. Marina Falcão',
  description: 'Artigos sobre ansiedade, burnout, luto, terapia de casal e saúde mental do trabalhador por Marina Falcão.',
};

async function getPosts(category?: string, search?: string) {
  try {
    let sql = 'SELECT * FROM posts WHERE published = 1';
    const params: any[] = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR summary LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';
    const posts = await query(sql, params);
    return posts || [];
  } catch (error) {
    return [];
  }
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const settings = await getSiteSettings();
  const { category, search } = await searchParams;
  const posts = await getPosts(category, search);

  const categories = [
    'Todos',
    'Ansiedade',
    'Burnout & Estresse',
    'Luto',
    'Terapia de Casal',
    'Saúde Mental',
  ];

  return (
    <div className="min-h-screen bg-warm-50 text-slate-800 flex flex-col font-sans">
      <Header settings={settings} />

      <main className="flex-grow py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-semibold text-brand-700 tracking-wider uppercase bg-brand-100 px-3.5 py-1.5 rounded-full">
              Artigos & Orientações
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
              Blog de Saúde Mental
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Reflexões embasadas na Análise do Comportamento e na prática clínica para cultivar equilíbrio e qualidade de vida.
            </p>
          </div>

          {/* Search and Category Filter */}
          <div className="max-w-3xl mx-auto mb-16 space-y-6">
            <form action="/blog" method="GET" className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search || ''}
                placeholder="Buscar por tema (ex: ansiedade, burnout, luto)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-warm-300 text-slate-900 shadow-warm-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex items-center justify-center flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = (!category && cat === 'Todos') || category === cat;
                return (
                  <Link
                    key={cat}
                    href={cat === 'Todos' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-brand-700 text-white shadow-warm-sm'
                        : 'bg-white text-slate-700 border border-warm-200 hover:bg-warm-100'
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8">
              <BookOpen className="w-12 h-12 text-warm-400 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-slate-900">Nenhum artigo encontrado</h3>
              <p className="text-sm text-slate-500 mt-1">Tente buscar por outros termos ou categorias.</p>
              <Link
                href="/blog"
                className="inline-block mt-4 text-xs font-bold text-brand-700 hover:underline"
              >
                Limpar filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-warm-200 overflow-hidden bg-white flex flex-col justify-between hover:shadow-warm-md transition-shadow group"
                >
                  <div>
                    {post.image_url ? (
                      <div className="aspect-video w-full overflow-hidden bg-warm-200 relative">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {post.video_url && (
                          <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Video className="w-3 h-3" /> Vídeo
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-brand-100 to-warm-200 flex items-center justify-center p-6 text-center">
                        <BookOpen className="w-10 h-10 text-brand-600" />
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full uppercase">
                          {post.category || 'Artigos'}
                        </span>
                        <span className="text-slate-400">
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-warm-100/60 mt-4 flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
                    >
                      Ler artigo <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} />
      <FloatingWhatsapp 
        whatsappNumber={settings.whatsapp_number} 
        whatsappMessage={settings.whatsapp_message} 
        avatarUrl={settings.bio_image_url || undefined}
      />
    </div>
  );
}
