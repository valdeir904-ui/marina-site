'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText, Plus, Trash2, Edit, LogOut, Eye, Video, Menu,
  Image as ImageIcon, CheckCircle, X, AlertCircle, LayoutDashboard,
  BarChart3, MousePointerClick, Clock, UploadCloud, Lock, Settings, Globe
} from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  image_url: string;
  video_url: string;
  video_type: 'youtube' | 'instagram';
  published: number;
  featured: number;
  views: number;
  created_at: string;
}

interface Stat {
  path: string;
  views: number;
  time_spent: number;
  conversions: number;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'settings'>('posts');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState<'youtube'|'instagram'>('youtube');
  const [featured, setFeatured] = useState(false);
  const [slug, setSlug] = useState('');
  const [published, setPublished] = useState(1);
  
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  // Password Change State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Settings State
  const [siteSettings, setSiteSettings] = useState({
    site_title: '', tagline: '', whatsapp_number: '', whatsapp_message: '',
    crp: '', address: '', google_reviews_url: '', doctoralia_url: '', instagram_url: '',
    bio_image_url: '', google_reviews_sync_enabled: 'false'
  });
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [syncingReviews, setSyncingReviews] = useState(false);

  const handleSyncReviews = async () => {
    try {
      setSyncingReviews(true);
      const res = await fetch('/api/google-reviews/sync');
      if (res.ok) {
        alert('Avaliações do Google e Doctoralia sincronizadas com sucesso!');
      } else {
        const error = await res.json();
        alert('Erro ao sincronizar: ' + (error.error || 'Erro Desconhecido'));
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setSyncingReviews(false);
    }
  };

  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resAuth, resPosts, resStats, resSettings] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/posts?all=true'), // Fetch all posts including drafts
        fetch('/api/analytics'),
        fetch('/api/settings')
      ]);

      if (resAuth.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (resPosts.status === 401) {
        router.push('/admin/login');
        return;
      }

      const dataPosts = await resPosts.json();
      const dataStats = await resStats.json();
      const dataSettings = await resSettings.json();

      setPosts(dataPosts.posts || []);
      setStats(dataStats.stats || []);
      if (dataSettings.settings) {
        setSiteSettings((prev) => ({ ...prev, ...dataSettings.settings }));
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Extrair categorias únicas para o datalist
  const uniqueCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingImage(true);
      setError('');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.url);
    } catch (err: any) {
      setError('Erro ao enviar imagem: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const openNewPostModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setCategory('Artigos');
    setImageUrl('');
    setVideoUrl('');
    setVideoType('youtube');
    setFeatured(false);
    setPublished(1);
    setError('');
    setIsModalOpen(true);
  };

  const openEditPostModal = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug || '');
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category || 'Artigos');
    setImageUrl(post.image_url || '');
    setVideoUrl(post.video_url || '');
    setVideoType(post.video_type || 'youtube');
    setFeatured(post.featured === 1);
    setPublished(post.published === undefined ? 1 : post.published);
    setError('');
    setIsModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, slug, summary, content, category, 
          image_url: imageUrl, video_url: videoUrl, video_type: videoType,
          featured, published
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar a postagem.');

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar postagem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta postagem?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setPasswordSubmitting(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro ao alterar a senha.');

      setPasswordSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (err: any) {
      setPasswordError(err.message || 'Erro ao alterar a senha.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Calc Totals
  const totalViews = stats.reduce((acc, s) => acc + s.views, 0);
  const totalConversions = stats.reduce((acc, s) => acc + s.conversions, 0);
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatPathName = (path: string) => {
    if (path === '/') return '🏠 Home (Página Inicial)';
    if (path === '/links') return '🔗 Bio Links';
    if (path === '/blog') return '📝 Blog (Vitrine)';
    
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return `📄 Artigo: ${title}`;
    }

    return path;
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSubmitting(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });

      if (!res.ok) throw new Error('Erro ao salvar as configurações.');
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setSettingsSubmitting(false);
    }
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\\s+/g, '-')           // Replace spaces with -
      .replace(/[^\\w\\-]+/g, '')       // Remove all non-word chars
      .replace(/\\-\\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!editingPost && !slug) { // Only auto-generate slug for new posts if it hasn't been manually edited yet
      setSlug(generateSlug(newTitle));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-white leading-tight">Painel Admin</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Dra. Marina Falcão</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => { setActiveTab('posts'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'posts' ? 'bg-brand-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            Postagens do Blog
          </button>
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'dashboard' ? 'bg-brand-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard & Métricas
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'settings' ? 'bg-brand-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            Configurações Gerais
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => { setIsPasswordModalOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
          >
            <Lock className="w-4 h-4" /> Alterar Senha
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800 px-4 py-3 rounded-xl transition-all text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header mobile (visible if needed) / Topbar for actions */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-slate-600 hover:text-brand-700">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {activeTab === 'dashboard' ? 'Métricas' : activeTab === 'settings' ? 'Configurações Gerais' : 'Postagens'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4" /> Sistema Online
            </span>
            {activeTab === 'posts' && (
              <button
                onClick={openNewPostModal}
                className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Artigo</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">Carregando dados...</div>
          ) : activeTab === 'dashboard' ? (
            // TAB: DASHBOARD
            <div className="space-y-8 max-w-6xl">
              {/* Resumo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 className="w-6 h-6" /></div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visualizações Totais</span>
                    <span className="text-2xl font-bold text-slate-900 block mt-1">{totalViews}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><MousePointerClick className="w-6 h-6" /></div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversões (WhatsApp)</span>
                    <span className="text-2xl font-bold text-slate-900 block mt-1">{totalConversions}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Média de Tempo</span>
                    <span className="text-2xl font-bold text-slate-900 block mt-1">
                      {stats.length > 0 ? formatTime(Math.round(stats.reduce((acc, s) => acc + s.time_spent, 0) / stats.length)) : '0s'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabela de Analytics */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">Desempenho por Página</h3>
                </div>

                {/* Mobile View (Cards) */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {stats.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">Nenhum dado registrado ainda.</div>
                  )}
                  {stats.map((stat) => (
                    <div key={stat.path} className="p-5 space-y-3">
                      <div className="font-medium text-brand-700 text-sm break-all">
                        {formatPathName(stat.path)}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Views</span>
                          <span className="block text-lg font-bold text-slate-700 mt-0.5">{stat.views}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tempo</span>
                          <span className="block text-lg font-semibold text-slate-600 mt-0.5">{formatTime(stat.time_spent)}</span>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100/50 text-center">
                          <span className="block text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">WPP</span>
                          <span className="block text-lg font-bold text-emerald-600 mt-0.5">{stat.conversions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th className="py-4 px-6">Rota / Página</th>
                        <th className="py-4 px-6 text-right">Visualizações</th>
                        <th className="py-4 px-6 text-right">Tempo Total Acumulado</th>
                        <th className="py-4 px-6 text-right">Conversões (Cliques WP)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {stats.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">Nenhum dado registrado ainda.</td>
                        </tr>
                      )}
                      {stats.map((stat) => (
                        <tr key={stat.path} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-medium text-brand-700">
                            {formatPathName(stat.path)}
                          </td>
                          <td className="py-4 px-6 text-right font-semibold text-slate-700">{stat.views}</td>
                          <td className="py-4 px-6 text-right text-slate-600">{formatTime(stat.time_spent)}</td>
                          <td className="py-4 px-6 text-right font-bold text-emerald-600">{stat.conversions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            // TAB: SETTINGS
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-6 sm:p-8 rounded-2xl shadow-sm text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-xl flex items-center gap-2"><Globe className="w-5 h-5 text-brand-200" /> Seu Link da Bio</h3>
                  <p className="text-brand-100 text-sm mt-1 max-w-md">Este é o link oficial para você colocar no perfil do seu Instagram. Ele centraliza o seu WhatsApp, artigos e avaliações em um só lugar.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => {
                      // Usar o window.location.origin para pegar o domínio atual (localhost ou o domínio oficial)
                      const url = `${window.location.origin}/links`;
                      navigator.clipboard.writeText(url);
                      alert('Link copiado para a área de transferência!');
                    }}
                    className="flex-1 md:flex-none bg-white text-brand-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors shadow-sm"
                  >
                    Copiar Link
                  </button>
                  <a href="/links" target="_blank" className="bg-brand-900/40 hover:bg-brand-900/60 px-5 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-white/10">
                    <Eye className="w-4 h-4" /> Acessar
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Detalhes do Consultório</h3>
                    <p className="text-slate-500 text-sm">Atualize seus dados de contato e informações públicas.</p>
                  </div>
                  {settingsSuccess && (
                    <span className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-4 h-4" /> Salvo
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome / Título do Site</label>
                      <input type="text" value={siteSettings.site_title || ''} onChange={(e) => setSiteSettings({...siteSettings, site_title: e.target.value})} placeholder="Ex: Psicóloga Marina Falcão" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slogan (Frase abaixo da foto)</label>
                      <input type="text" value={siteSettings.tagline || ''} onChange={(e) => setSiteSettings({...siteSettings, tagline: e.target.value})} placeholder="Ex: Tudo começa na sua saúde mental." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Número do WhatsApp (Apenas Números)</label>
                      <input type="text" value={siteSettings.whatsapp_number} onChange={(e) => setSiteSettings({...siteSettings, whatsapp_number: e.target.value})} placeholder="Ex: 5516997712697" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Número do CRP</label>
                      <input type="text" value={siteSettings.crp} onChange={(e) => setSiteSettings({...siteSettings, crp: e.target.value})} placeholder="Ex: CRP 06/162899" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mensagem Padrão do WhatsApp</label>
                    <textarea rows={2} value={siteSettings.whatsapp_message} onChange={(e) => setSiteSettings({...siteSettings, whatsapp_message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Endereço de Atendimento</label>
                    <input type="text" value={siteSettings.address} onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link do Instagram</label>
                      <input type="url" value={siteSettings.instagram_url || ''} onChange={(e) => setSiteSettings({...siteSettings, instagram_url: e.target.value})} placeholder="https://instagram.com/..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link do Doctoralia</label>
                      <input type="url" value={siteSettings.doctoralia_url || ''} onChange={(e) => setSiteSettings({...siteSettings, doctoralia_url: e.target.value})} placeholder="https://www.doctoralia.com.br/..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Foto da página "Link da Bio"</label>
                    <div className="flex items-center gap-4">
                      {siteSettings.bio_image_url ? (
                        <img src={siteSettings.bio_image_url} alt="Foto da Bio" className="w-16 h-16 rounded-full object-cover border-2 border-brand-500" />
                      ) : (
                        <img src="/images/marina-avatar.jpg" alt="Foto da Bio" className="w-16 h-16 rounded-full object-cover border-2 border-brand-500" />
                      )}
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-2 text-sm">
                        <UploadCloud className="w-4 h-4" />
                        {uploadingImage ? 'Enviando...' : 'Trocar Foto'}
                        <input type="file" accept="image/*" onChange={async (e) => {
                          if (!e.target.files || e.target.files.length === 0) return;
                          const file = e.target.files[0];
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            setUploadingImage(true);
                            const res = await fetch('/api/upload', { method: 'POST', body: formData });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error);
                            setSiteSettings({...siteSettings, bio_image_url: data.url});
                          } catch (err: any) {
                            alert('Erro ao enviar imagem: ' + err.message);
                          } finally {
                            setUploadingImage(false);
                          }
                        }} className="hidden" disabled={uploadingImage} />
                      </label>
                      {siteSettings.bio_image_url && (
                        <button type="button" onClick={() => setSiteSettings({...siteSettings, bio_image_url: ''})} className="text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-slate-100">
                    <div className="mb-6">
                      <h3 className="font-bold text-slate-800 text-lg">Automação de Avaliações</h3>
                      <p className="text-slate-500 text-sm">Gerencie como os depoimentos do Google são buscados e atualizados.</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="block text-slate-900 mb-1">Sincronização Automática (7 em 7 dias)</strong>
                          <span className="text-xs text-slate-500 block max-w-sm">
                            Habilita ou desabilita o cron job que busca novas avaliações periodicamente.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={siteSettings.google_reviews_sync_enabled === 'true'}
                            onChange={(e) => setSiteSettings({...siteSettings, google_reviews_sync_enabled: e.target.checked ? 'true' : 'false'})}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                        <div>
                          <strong className="block text-slate-900 mb-1">Forçar Sincronização Agora</strong>
                          <span className="text-xs text-slate-500 block max-w-sm">
                            Busca imediatamente as avaliações no Google Places e junta com os depoimentos fixos.
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={handleSyncReviews}
                          disabled={syncingReviews}
                          className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                          {syncingReviews ? 'Buscando...' : 'Buscar avaliações agora'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 mt-6">
                    <button type="submit" disabled={settingsSubmitting} className="px-8 py-3 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 transition-all shadow-md disabled:opacity-50">
                      {settingsSubmitting ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            // TAB: POSTS
            <div className="w-full space-y-4">
              
              {/* Mobile View (Cards) */}
              <div className="block md:hidden space-y-4">
                {posts.length === 0 && (
                  <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
                    Nenhuma postagem cadastrada. Clique em "Novo Artigo" para começar.
                  </div>
                )}
                {posts.map((post) => (
                  <div key={post.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <div className="font-bold text-slate-900 text-base mb-1 leading-tight flex items-center gap-2">
                        {post.featured === 1 && <span title="Em destaque" className="text-yellow-400">⭐</span>}
                        {post.title}
                      </div>
                      <div className="text-sm text-slate-500 line-clamp-2">{post.summary}</div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${post.published === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {post.published === 1 ? '🟢 Publicado' : '🟡 Rascunho'}
                        </span>
                        <span className="bg-brand-50 text-brand-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-brand-200 uppercase tracking-wider">
                          {post.category || 'Artigos'}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          {post.image_url && <span title="Possui Imagem"><ImageIcon className="w-4 h-4 text-emerald-500" /></span>}
                          {post.video_url && <span title={`Possui Vídeo (${post.video_type})`}><Video className="w-4 h-4 text-rose-500" /></span>}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <a href={`/blog/${post.slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 font-medium text-sm rounded-xl hover:bg-slate-100 transition-colors">
                        <Eye className="w-4 h-4" /> Ver
                      </a>
                      <button onClick={() => openEditPostModal(post)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-50 text-amber-700 font-medium text-sm rounded-xl hover:bg-amber-100 transition-colors">
                        <Edit className="w-4 h-4" /> Editar
                      </button>
                      <button onClick={() => handleDeletePost(post.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-rose-50 text-rose-600 font-medium text-sm rounded-xl hover:bg-rose-100 transition-colors">
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View (Table) */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th className="py-4 px-6 w-1/2">Artigo</th>
                        <th className="py-4 px-6">Categoria</th>
                        <th className="py-4 px-6">Mídias</th>
                        <th className="py-4 px-6">Data</th>
                        <th className="py-4 px-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {posts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            Nenhuma postagem cadastrada. Clique em "Novo Artigo" para começar.
                          </td>
                        </tr>
                      )}
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors flex items-center gap-2">
                              {post.featured === 1 && <span title="Em destaque" className="text-yellow-400 text-sm">⭐</span>}
                              {post.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{post.summary}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border whitespace-nowrap mr-2 ${post.published === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {post.published === 1 ? '🟢 Publicado' : '🟡 Rascunho'}
                            </span>
                            <span className="bg-brand-50 text-brand-800 text-[11px] font-bold px-3 py-1 rounded-full border border-brand-200 whitespace-nowrap">
                              {post.category || 'Artigos'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-slate-400">
                              {post.image_url && <span title="Possui Imagem"><ImageIcon className="w-4 h-4 text-emerald-500" /></span>}
                              {post.video_url && <span title={`Possui Vídeo (${post.video_type})`}><Video className="w-4 h-4 text-rose-500" /></span>}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a href={`/blog/${post.slug}`} target="_blank" className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors" title="Ver post">
                                <Eye className="w-4 h-4" />
                              </a>
                              <button onClick={() => openEditPostModal(post)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors" title="Editar">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeletePost(post.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Excluir">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Datalist for Categories */}
      <datalist id="categories-list">
        {uniqueCategories.map(cat => <option key={cat} value={cat} />)}
      </datalist>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-full">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingPost ? 'Editar Artigo' : 'Publicar Novo Artigo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form id="post-form" onSubmit={handleSavePost} className="space-y-5 text-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título do Artigo</label>
                    <input
                      type="text" required value={title} onChange={handleTitleChange}
                      placeholder="Ex: Como Reconhecer os Sinais de Burnout"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link (URL)</label>
                    <div className="flex items-center w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500 transition-all">
                      <span className="text-slate-400 text-sm hidden sm:inline mr-1">/blog/</span>
                      <input
                        type="text" required value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))}
                        placeholder="como-reconhecer-burnout"
                        className="w-full bg-transparent text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</label>
                    <input
                      list="categories-list"
                      required value={category} onChange={(e) => setCategory(e.target.value)}
                      placeholder="Digite ou selecione..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Imagem de Capa (Upload)</label>
                    <div className="relative flex items-center gap-3">
                      <label className="cursor-pointer shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        {uploadingImage ? 'Enviando...' : 'Escolher Arquivo'}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                      </label>
                      <input 
                        type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                        placeholder="URL gerada..." 
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-500 bg-slate-50 outline-none text-xs" 
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Video className="w-4 h-4 text-brand-600" /> Mídia em Vídeo (Opcional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Origem do Vídeo</label>
                      <select 
                        value={videoType} onChange={(e) => setVideoType(e.target.value as 'youtube'|'instagram')}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      >
                        <option value="youtube">YouTube (Horizontal)</option>
                        <option value="instagram">Instagram / TikTok (Vertical)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL do Vídeo</label>
                      <input
                        type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <input
                      type="checkbox"
                      id="featured-checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                    />
                    <label htmlFor="featured-checkbox" className="text-sm font-bold text-amber-900 cursor-pointer">
                      ⭐ Destacar na Página Inicial
                    </label>
                  </div>
                  <div className="space-y-1">
                    <select 
                      value={published} onChange={(e) => setPublished(Number(e.target.value))}
                      className={`w-full px-4 py-4 rounded-xl border font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-colors ${published === 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                    >
                      <option value={1}>🟢 Publicar Imediatamente</option>
                      <option value={0}>🟡 Salvar como Rascunho</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resumo Curto (Para os Cards)</label>
                  <textarea
                    rows={2} required value={summary} onChange={(e) => setSummary(e.target.value)}
                    placeholder="Breve chamada descritiva do artigo..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1 pb-10">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Texto Completo</label>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      placeholder="Escreva o artigo aqui..."
                      className="min-h-[300px]"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'clean']
                        ],
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
              <button 
                type="submit" form="post-form" disabled={submitting || uploadingImage} 
                className="px-8 py-2.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? 'Salvando...' : <><CheckCircle className="w-4 h-4"/> Salvar Artigo</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-600" />
                Alterar Senha
              </h3>
              <button onClick={() => {setIsPasswordModalOpen(false); setPasswordError(''); setPasswordSuccess('');}} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {passwordError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form id="password-form" onSubmit={handleChangePassword} className="space-y-4 text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha Atual</label>
                  <input
                    type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Sua senha atual..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nova Senha</label>
                  <input
                    type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo de 6 caracteres..." minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmar Nova Senha</label>
                  <input
                    type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha..." minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => {setIsPasswordModalOpen(false); setPasswordError(''); setPasswordSuccess('');}} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
              <button 
                type="submit" form="password-form" disabled={passwordSubmitting} 
                className="px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {passwordSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
