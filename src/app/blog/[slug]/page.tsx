import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';
import { ArrowLeft, Calendar, MessageCircle, Share2, Tag, Video } from 'lucide-react';

async function getPostBySlug(slug: string) {
  try {
    const posts = await query('SELECT * FROM posts WHERE slug = ? AND published = 1', [slug]);
    return posts && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Postagem Não Encontrada' };
  }

  return {
    title: `${post.title} | Blog Marina Falcão`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const whatsappNumber = settings.whatsapp_number || '5516997712697';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
    `Oi Marina! 🖐 Li o artigo "${post.title}" e gostaria de agendar uma consulta de terapia!`
  )}`;

  // Helper para garantir que links do Instagram e YouTube funcionem no iframe
  let finalVideoUrl = post.video_url;
  if (finalVideoUrl) {
    if (finalVideoUrl.includes('instagram.com') && !finalVideoUrl.includes('embed')) {
      // Instagram's embed doesn't like /reels/ (plural) as it causes a redirect that breaks the iframe
      finalVideoUrl = finalVideoUrl.replace('/reels/', '/reel/');
      // Remove query params like ?igsh=... and append embed/
      finalVideoUrl = finalVideoUrl.split('?')[0].replace(/\/$/, '') + '/embed/';
    } else if (finalVideoUrl.includes('youtube.com') && finalVideoUrl.includes('watch?v=')) {
      finalVideoUrl = finalVideoUrl.replace('watch?v=', 'embed/');
    } else if (finalVideoUrl.includes('youtu.be/')) {
      finalVideoUrl = finalVideoUrl.replace('youtu.be/', 'youtube.com/embed/');
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="flex-grow py-12 md:py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-700 bg-white px-4 py-2 rounded-full border border-warm-200 shadow-warm-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para o Blog
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-6 text-center md:text-left mb-10">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-medium text-slate-500">
              <span className="bg-brand-100 text-brand-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category || 'Artigos'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(post.created_at).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal italic border-l-4 border-brand-400 pl-4 bg-white/50 py-2 rounded-r-xl">
              {post.summary}
            </p>
          </header>

          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-10 rounded-3xl overflow-hidden shadow-warm-md border border-warm-200">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Video Embed Section if present */}
          {post.video_url && (
            <div className="mb-10 p-6 rounded-3xl bg-slate-900 text-white shadow-warm-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider">
                <Video className="w-4 h-4" /> Vídeo Explicativo
              </div>
              <div className={`relative ${post.video_type === 'instagram' ? 'aspect-[9/16] max-w-[400px] mx-auto' : 'aspect-video'} rounded-2xl overflow-hidden bg-black`}>
                <iframe
                  className="w-full h-full"
                  src={finalVideoUrl}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Main Article Body */}
          <div
            className="prose prose-lg prose-slate max-w-none w-full break-words [&_*]:break-words [&_p]:whitespace-normal bg-white p-8 sm:p-12 rounded-3xl border border-warm-200 shadow-warm-sm leading-relaxed text-slate-700 font-sans overflow-x-hidden"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author & CTA Card */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-brand-100/80 via-warm-100 to-sage-100/60 border border-brand-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-warm-md">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase text-brand-700 tracking-wider">
                Escrito por Dra. Marina Falcão
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Gostaria de agendar uma consulta para conversar sobre este assunto?
              </h3>
              <p className="text-sm text-slate-600">
                Atendimento presencial em Ribeirão Preto - SP e sessões de psicoterapia on-line.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-warm-sm hover:shadow-warm-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </article>
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
