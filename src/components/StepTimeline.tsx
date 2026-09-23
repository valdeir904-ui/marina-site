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
    <div className="relative max-w-7xl mx-auto py-10">
      {/* Linha horizontal conectora (apenas em telas grandes) */}
      <div className="hidden lg:block absolute top-[4.5rem] left-[12%] right-[12%] h-px bg-warm-200"></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <Reveal 
              key={step.number} 
              animation="fade-up" 
              delay={idx * 150}
              className="relative flex flex-col items-center group h-full"
            >
              {/* Ícone central / Número */}
              <div className="relative z-10 flex flex-col items-center justify-center shrink-0 mb-6 lg:mb-8">
                <div className="w-16 h-16 rounded-full bg-white border-8 border-warm-50 shadow-sm flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:border-brand-100 group-hover:text-white transition-all duration-500">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                {/* Linha vertical no mobile para conectar */}
                {idx !== steps.length - 1 && (
                  <div className="lg:hidden absolute top-16 bottom-[-3rem] w-px bg-warm-200"></div>
                )}
              </div>

              {/* Conteúdo do cartão */}
              <div className="w-full max-w-sm text-center px-4 flex-1 flex flex-col">
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-warm-200 shadow-sm hover:shadow-warm-lg transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 flex-1 flex flex-col">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50/50 rounded-bl-[3rem] -z-10 transition-transform group-hover:scale-150"></div>
                  
                  <span className="inline-block font-serif text-4xl text-brand-100 leading-none mb-3 font-bold">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{step.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
