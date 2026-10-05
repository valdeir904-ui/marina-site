const fs = require('fs');
let code = fs.readFileSync('src/app/admin/dashboard/page.tsx', 'utf8');

const targetStart = code.indexOf('{/* LADO ESQUERDO: Configurações */}');
const targetEnd = code.indexOf('</form>', targetStart);

if (targetStart === -1 || targetEnd === -1) {
    console.error("Could not find boundaries.");
    process.exit(1);
}

const newLayout = `{/* LADO ESQUERDO: Configurações */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Título */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título do Artigo</label>
                    <input
                      type="text" required value={title} onChange={handleTitleChange}
                      placeholder="Ex: Como Reconhecer os Sinais de Burnout"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>

                  {/* Categoria e Destaque */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</label>
                      <div className="relative">
                        <select
                          required value={category} onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white appearance-none"
                        >
                          <option value="" disabled>Selecione uma categoria...</option>
                          {uniqueCategories.includes('Artigos') ? null : <option value="Artigos">Artigos</option>}
                          {uniqueCategories.includes('Ansiedade') ? null : <option value="Ansiedade">Ansiedade</option>}
                          {uniqueCategories.includes('Burnout') ? null : <option value="Burnout">Burnout</option>}
                          {uniqueCategories.includes('Relacionamentos') ? null : <option value="Relacionamentos">Relacionamentos</option>}
                          {uniqueCategories.includes('Redes Sociais') ? null : <option value="Redes Sociais">Redes Sociais</option>}
                          {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100 h-[46px]">
                      <input
                        type="checkbox"
                        id="featured-checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500 shrink-0"
                      />
                      <label htmlFor="featured-checkbox" className="text-xs font-bold text-amber-900 cursor-pointer select-none">
                        ⭐ Destacar na Home
                      </label>
                    </div>
                  </div>

                  {/* Imagem de Capa */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Imagem de Capa (Upload)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1 w-full">
                        <label className="cursor-pointer w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center justify-center gap-2">
                          <UploadCloud className="w-5 h-5 shrink-0" />
                          <span className="truncate">{uploadingImage ? 'Enviando...' : imageUrl ? 'Trocar Imagem' : 'Escolher Arquivo'}</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                        </label>
                        <p className="text-[11px] text-slate-400 mt-2">Tamanho recomendado: 1200x630 pixels. (Formato: Retangular)</p>
                      </div>
                      
                      {imageUrl && (
                        <div className="relative w-32 h-20 shrink-0 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                          <img src={imageUrl} alt="Capa" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setImageUrl('')} className="absolute top-1 right-1 bg-white/90 hover:bg-rose-50 text-rose-600 p-1 rounded-md shadow-sm transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mídia em Vídeo */}
                  <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Video className="w-4 h-4 text-brand-600" /> Mídia em Vídeo (Opcional)
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={!!videoUrl}
                          onChange={(e) => {
                            if (!e.target.checked) setVideoUrl('');
                            else setVideoUrl(' ');
                          }}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                    
                    {!!videoUrl && (
                      <div className="pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                          <div className="flex-1 space-y-4 w-full">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Formato do Vídeo</label>
                              <select 
                                value={videoType} onChange={(e) => setVideoType(e.target.value as 'youtube'|'instagram')}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                              >
                                <option value="youtube">YouTube (Horizontal)</option>
                                <option value="instagram">Instagram / TikTok (Vertical)</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link do Vídeo</label>
                              <input
                                type="url" value={videoUrl.trim()} onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="Cole o link..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                              />
                            </div>
                          </div>
                          
                          {videoUrl.trim() && (
                            <div className="shrink-0 w-28 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner" style={{ aspectRatio: videoType === 'instagram' ? '9/16' : '16/9' }}>
                              <div className="text-slate-400 flex flex-col items-center gap-1.5 p-2 text-center">
                                <Video className="w-5 h-5 opacity-50" />
                                <span className="text-[10px] leading-tight opacity-80">Prévia<br/>Habilitada</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* LADO DIREITO: Editor de Texto */}
                <div className="lg:col-span-7 flex flex-col space-y-6 h-full min-h-[500px]">
                  
                  {/* Resumo */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resumo Curto (Para os Cards)</label>
                    <textarea
                      rows={2} required value={summary} onChange={(e) => setSummary(e.target.value)}
                      placeholder="Breve chamada descritiva do artigo..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Editor */}
                  <div className="flex flex-col flex-1 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Texto Completo</label>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col flex-1 h-full min-h-[400px]">
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        placeholder="Escreva o artigo aqui..."
                        className="flex-1 overflow-y-auto"
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
                </div>
              `;

const oldBlock = code.substring(targetStart, targetEnd);
code = code.replace(oldBlock, newLayout + '\n              ');

fs.writeFileSync('src/app/admin/dashboard/page.tsx', code);
console.log("Success");
