import React from 'react';

export default function StepTimeline() {
  const steps = [
    {
      number: '1',
      title: 'Contato inicial',
      description: 'Envie uma mensagem pelo WhatsApp para tirar dúvidas e verificar os horários disponíveis.',
    },
    {
      number: '2',
      title: 'Agendamento',
      description: 'Escolha a modalidade — presencial em Ribeirão Preto ou on-line — e o melhor dia para você.',
    },
    {
      number: '3',
      title: 'Primeira sessão',
      description: 'Um espaço seguro de acolhimento para mapear suas necessidades e traçar metas terapêuticas.',
    },
    {
      number: '4',
      title: 'Acompanhamento',
      description: 'Sessões contínuas focadas no autoconhecimento, na regulação emocional e na qualidade de vida.',
    },
  ];

  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
      {steps.map((step) => (
        <li key={step.number} className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="font-serif text-4xl text-brand-300 leading-none">{step.number}</span>
            <span className="h-px flex-1 bg-warm-300" aria-hidden="true"></span>
          </div>
          <h3 className="font-serif text-xl text-slate-900">{step.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
