import React from 'react';
import Reveal from './Reveal';

interface AboutSectionProps {
  whatsappUrl: string;
}

export default function AboutSection({ whatsappUrl }: AboutSectionProps) {
  return (
    <section id="sobre" className="py-20 lg:py-32 bg-white overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Imagem (Esquerda) */}
          <Reveal animation="slide-right" className="relative order-2 lg:order-1">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:max-w-none rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="/images/marina-profile.jpg" 
                alt="Psicóloga Marina Falcão" 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay"></div>
            </div>
            
            {/* Decoração sutil */}
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sage-200/60 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-brand-200/60 rounded-full blur-3xl -z-10"></div>
          </Reveal>

          {/* Texto (Direita) */}
          <div className="space-y-8 order-1 lg:order-2">
            <Reveal animation="slide-left">
              <div className="space-y-4">
                <p className="kicker">Sobre Mim</p>
                <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 leading-tight">
                  Prazer, sou a <br className="hidden sm:block" />
                  <span className="text-brand-700">Marina Falcão</span>
                </h2>
              </div>
            </Reveal>

            <Reveal animation="slide-left" delay={100}>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Sou psicóloga clínica com fundamentação na Análise do Comportamento. Minha missão é ajudar você a atravessar momentos de dor e esgotamento com acolhimento, técnica validada e empatia genuína.
                </p>
                <p>
                  Tenho dedicação especial ao acompanhamento de <strong>Luto, Ansiedade, Burnout e Saúde Mental</strong>. Acredito firmemente que o processo terapêutico não serve apenas para "apagar" os seus sintomas, mas sim para resgatar a sua qualidade de vida e construir uma rotina com mais sentido.
                </p>
                <p>
                  Trabalharemos juntos para entender a sua história, os seus limites e as suas maiores potências. Eu ofereço um espaço seguro, livre de qualquer julgamento, onde a sua dor é respeitada e, passo a passo, transformada.
                </p>
              </div>
            </Reveal>

            <Reveal animation="slide-left" delay={200}>
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="bg-warm-50/80 p-5 rounded-2xl border border-warm-200">
                  <p className="text-4xl font-serif text-brand-700 mb-2">+1000</p>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Sessões Realizadas</p>
                </div>
                <div className="bg-warm-50/80 p-5 rounded-2xl border border-warm-200">
                  <p className="text-4xl font-serif text-brand-700 mb-2">100%</p>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Atendimento On-line</p>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </div>
    </section>
  );
}
