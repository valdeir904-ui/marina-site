import React from 'react';
import Reveal from './Reveal';
import { MessageCircle, CalendarClock, HeartHandshake, Sprout } from 'lucide-react';

export default function StepTimeline() {
  const steps = [
    {
      number: '01',
      title: 'Contato inicial',
      description: 'Envie uma mensagem pelo WhatsApp para tirar dúvidas e verificar os horários disponíveis de forma simples.',
      icon: MessageCircle,
    },
    {
      number: '02',
      title: 'Agendamento',
      description: 'Escolha a modalidade, o melhor dia e horário para a sua sessão de forma prática e rápida.',
      icon: CalendarClock,
    },
    {
      number: '03',
      title: 'Primeira sessão',
      description: 'Um espaço seguro de acolhimento para mapear suas necessidades latentes e traçar metas terapêuticas.',
      icon: HeartHandshake,
    },
    {
      number: '04',
      title: 'Acompanhamento',
      description: 'Sessões semanais focadas no autoconhecimento, na regulação emocional e na melhoria da sua qualidade de vida.',
      icon: Sprout,
    },
  ];

  return (
    <div className="relative max-w-5xl mx-auto py-10">
      {/* Linha vertical central (visível apenas em telas grandes) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-warm-200 transform -translate-x-1/2"></div>

      <div className="space-y-16 md:space-y-12">
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          const Icon = step.icon;

          return (
            <Reveal 
              key={step.number} 
              animation={isEven ? 'slide-right' : 'slide-left'} 
              delay={idx * 150}
              className={`relative flex flex-col md:flex-row items-center justify-between group ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Espaço vazio para empurrar o conteúdo na grid (desktop) */}
              <div className="hidden md:block w-5/12"></div>

              {/* Ícone central / Número */}
              <div className="relative z-10 flex flex-col items-center justify-center shrink-0 mb-8 md:mb-0">
                <div className="w-16 h-16 rounded-full bg-white border-8 border-warm-50 shadow-sm flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:border-brand-100 group-hover:text-white transition-all duration-500">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                {/* Linha vertical no mobile para conectar */}
                {idx !== steps.length - 1 && (
                  <div className="md:hidden absolute top-16 bottom-[-4rem] w-px bg-warm-200"></div>
                )}
              </div>

              {/* Conteúdo do cartão */}
              <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'} text-center px-4 md:px-0`}>
                <div className="bg-white p-8 rounded-[2rem] border border-warm-200 shadow-sm hover:shadow-warm-lg transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                  <div className={`absolute top-0 ${isEven ? 'right-0 rounded-bl-[3rem]' : 'left-0 rounded-br-[3rem]'} w-24 h-24 bg-brand-50/50 -z-10 transition-transform group-hover:scale-150`}></div>
                  
                  <span className="inline-block font-serif text-5xl text-brand-100 leading-none mb-4 font-bold">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-2xl text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
