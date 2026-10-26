import React from 'react';
import Image from 'next/image';
import Reveal from './Reveal';

export default function AboutSection() {
  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Imagem (Esquerda) */}
          <Reveal animation="slide-right" className="relative order-2 lg:order-1 flex justify-center">
            <div className="relative w-full aspect-[4/5] max-w-sm sm:max-w-md lg:max-w-[420px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image 
                src="/images/marina-sobre.jpg" 
                alt="Psicóloga Marina Falcão - Atendimento On-line" 
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-[center_30%] scale-[1.25] hover:scale-[1.3] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay pointer-events-none"></div>
            </div>
            
            {/* Decoração sutil */}
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sage-200/60 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-brand-200/60 rounded-full blur-3xl -z-10"></div>
          </Reveal>

          {/* Texto (Direita) */}
          <div className="space-y-6 order-1 lg:order-2">
            <Reveal animation="slide-left">
              <div className="space-y-3">
                <p className="kicker">Sobre Mim</p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
                  Prazer, sou a <br className="hidden sm:block" />
                  <span className="text-brand-700">Marina Falcão</span>
                </h2>
                <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Psicóloga Clínica • CRP 06/162899 • Desde 2022
                </p>
              </div>
            </Reveal>

            <Reveal animation="slide-left" delay={100}>
              <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                <p>
                  Sou psicóloga clínica com fundamentação na Análise do Comportamento. Minha missão é ajudar você a atravessar momentos de dor e esgotamento com acolhimento, técnica validada e empatia genuína.
                </p>
                <p>
                  Tenho dedicação ao acompanhamento de adultos em <strong>Luto, Ansiedade, Burnout, Questões de Relacionamento e Saúde Mental</strong>. O processo terapêutico é um caminho seguro para compreender sua história, fortalecer sua autonomia e resgatar o sentido de viver com presença.
                </p>
                {/* Integração de A Ciência da Mente (Neuropsicologia & Psicofarmacologia) */}
                <p className="border-l-2 border-brand-300 pl-4 text-slate-700 text-sm sm:text-base bg-warm-50/60 py-2 rounded-r-xl">
                  Compreendo o funcionamento humano integrando comportamento, emoção e neurobiologia. Minha prática dialoga de perto com a neuropsicologia e apoia os tratamentos médicos multidisciplinares, fundamentando cada intervenção no rigor da ciência.
                </p>
              </div>
            </Reveal>

            <Reveal animation="slide-left" delay={200}>
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 text-center">
                  <p className="text-2xl sm:text-3xl font-serif text-brand-700 font-bold mb-1">+1000</p>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Sessões Realizadas</p>
                </div>
                <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 text-center">
                  <p className="text-2xl sm:text-3xl font-serif text-brand-700 font-bold mb-1">100%</p>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">On-line</p>
                </div>
                <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 text-center col-span-2 sm:col-span-1">
                  <p className="text-2xl sm:text-3xl font-serif text-brand-700 font-bold mb-1">CRP 06</p>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Atuação Ética</p>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </div>
    </section>
  );
}
