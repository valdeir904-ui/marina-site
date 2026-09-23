import React from 'react';
import Reveal from './Reveal';
import { HeartCrack, ShieldAlert, BrainCircuit, Activity, BatteryWarning, TestTubeDiagonal } from 'lucide-react';
import Link from 'next/link';

export default function DeepDiveSections() {
  return (
    <div className="flex flex-col">
      {/* SEÇÃO 1: Crises, Luto e Ressignificação (Tom Acolhedor / Escuro) */}
      <section className="relative py-24 lg:py-32 bg-slate-900 text-slate-100 overflow-hidden">
        {/* Background Grafismos */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal animation="slide-right">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-3 font-serif text-sm font-semibold tracking-widest uppercase text-brand-300">
                  <span className="w-8 h-px bg-brand-400"></span> Luto & Crises Extremas
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
                  Quando a dor parece não caber em você.
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                  Processar uma perda significativa ou lidar com pensamentos de desesperança exige mais do que apenas tempo. Exige um espaço seguro de <strong className="text-white">Tanatologia e Suicidologia</strong>, onde sua dor é validada, sem julgamentos ou pressa para "superar".
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <div className="w-12 h-12 rounded-full bg-brand-900/40 flex items-center justify-center shrink-0">
                      <HeartCrack className="w-6 h-6 text-brand-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Acolhimento ao Luto</h4>
                      <p className="text-xs text-slate-400">Ressignificação de perdas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <div className="w-12 h-12 rounded-full bg-brand-900/40 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-6 h-6 text-brand-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Prevenção e Crises</h4>
                      <p className="text-xs text-slate-400">Intervenção em Suicidologia</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal animation="slide-left" delay={200} className="lg:justify-self-end">
              <div className="bg-slate-800/40 p-8 sm:p-12 rounded-[3rem] border border-slate-700/50 backdrop-blur-sm max-w-md">
                <blockquote className="font-serif text-xl sm:text-2xl text-slate-200 leading-relaxed italic mb-8">
                  "O luto não é uma doença a ser curada, é um processo a ser vivido. E você não precisa passar por isso em silêncio."
                </blockquote>
                <Link 
                  href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20Marina.%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20acolhimento%20para%20mim." 
                  target="_blank" 
                  data-track="cta-luto-crise"
                  className="inline-flex items-center justify-center w-full px-8 py-4 bg-brand-300 text-slate-950 rounded-full font-semibold hover:bg-brand-200 transition-colors"
                >
                  Agendar acolhimento
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: Esgotamento e Rotina (Burnout & Saúde Mental) */}
      <section className="py-24 lg:py-32 bg-warm-100 text-slate-900 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <Reveal animation="fade-up" className="lg:col-span-5 lg:order-2">
              <div className="space-y-6">
                <span className="kicker">Rotina & Esgotamento</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-brand-900 leading-tight">
                  Recupere o controle da sua vitalidade.
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  O esgotamento mental e o <strong>Síndrome de Burnout</strong> roubam sua energia e o prazer pelas coisas simples. A psicoterapia focada na saúde mental da rotina corporativa ajuda a reconstruir limites saudáveis e devolver a clareza mental que o estresse constante apagou.
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                      <BatteryWarning className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900">Manejo de Burnout</strong>
                      <span className="text-slate-600 text-sm">Técnicas de recuperação de energia e estresse crônico.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0 text-teal-700">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900">Regulação Emocional</strong>
                      <span className="text-slate-600 text-sm">Ferramentas para lidar com a ansiedade do dia a dia.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal animation="fade-up" delay={200} className="lg:col-span-7 lg:order-1 relative">
              <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[500px] w-full bg-brand-200/30 rounded-[3rem] border border-brand-100/50 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 to-warm-100/20 mix-blend-overlay"></div>
                 <h3 className="font-serif text-3xl sm:text-4xl text-brand-800 mb-6 relative z-10 max-w-lg">
                   A exaustão não é um troféu. É um sinal de que algo precisa mudar.
                 </h3>
                 <Link 
                  href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20Marina.%20Vim%20pelo%20site%20e%20gostaria%20de%20falar%20sobre%20minha%20rotina%20e%20cansa%C3%A7o." 
                  target="_blank" 
                  data-track="cta-burnout-rotina"
                  className="relative z-10 px-8 py-4 bg-brand-800 text-white rounded-full font-semibold hover:bg-brand-700 transition-colors shadow-lg"
                >
                  Falar sobre minha rotina
                </Link>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* SEÇÃO 3: A Ciência por trás da Mente (Neuropsicologia & Psicofarmacologia) */}
      <section className="py-24 lg:py-32 bg-white text-slate-900 relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal animation="fade-up">
              <span className="kicker justify-center mb-6">A Ciência da Mente</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Compreendendo o funcionamento biológico e psíquico.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Tratamentos modernos exigem conhecimento profundo. Compreender a <strong>Neurobiologia</strong> e a <strong>Psicofarmacologia</strong> dos transtornos mentais permite uma intervenção muito mais precisa, atuando na raiz do problema e otimizando resultados — inclusive trabalhando em conjunto com seu psiquiatra.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal animation="slide-right" delay={100}>
              <div className="bg-sage-50 p-10 rounded-[2rem] border border-sage-100 h-full hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-sage-600 mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Neuropsicologia</h3>
                <p className="text-slate-600 leading-relaxed">
                  Avaliação detalhada das funções cognitivas, como memória, atenção e funções executivas. Um entendimento estrutural de como o seu cérebro processa informações e emoções.
                </p>
              </div>
            </Reveal>

            <Reveal animation="slide-left" delay={200}>
              <div className="bg-brand-50 p-10 rounded-[2rem] border border-brand-100 h-full hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                  <TestTubeDiagonal className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Psicofarmacologia</h3>
                <p className="text-slate-600 leading-relaxed">
                  Apoio ao tratamento medicamentoso. Entendimento clínico de como as medicações psiquiátricas interagem com os aspectos psicológicos, auxiliando na estabilização do quadro.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
}
