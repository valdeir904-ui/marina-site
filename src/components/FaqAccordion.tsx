'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqsClassic: FaqItem[] = [
  {
    question: 'Como funciona a primeira sessão de psicoterapia?',
    answer:
      'A primeira sessão é um momento de acolhimento e escuta atenta. Nela, conversamos sobre suas principais queixas, sua história e o que você busca com a terapia. É o espaço para você se sentir à vontade, tirar todas as suas dúvidas e traçarmos juntos os objetivos do seu processo.',
  },
  {
    question: 'Como funcionam as consultas on-line? São seguras e sigilosas?',
    answer:
      'Sim, 100% seguras. As consultas on-line acontecem por videochamada através de plataformas criptografadas que atendem a todas as resoluções de sigilo e ética do Conselho Federal de Psicologia (CFP). Você só precisa de um ambiente privativo e uma boa conexão com a internet.',
  },
  {
    question: 'O que é a Análise do Comportamento e quais os seus benefícios?',
    answer:
      'A Análise do Comportamento é uma abordagem científica que busca compreender como seus comportamentos, pensamentos e emoções se relacionam com o seu ambiente e sua história de vida. Ela ajuda a identificar gatilhos automáticos de ansiedade e burnout para construir estratégias práticas e duradouras de mudança.',
  },
  {
    question: 'Quais as formas de pagamento e como funciona o recibo para reembolso do plano de saúde?',
    answer:
      'O pagamento pode ser realizado via PIX ou cartão. Ao final de cada sessão ou pacote mensal, forneço o recibo com todas as especificações e meu registro CRP 06/162899 para que você possa solicitar o reembolso integral ou parcial junto ao seu convênio médico.',
  },
  {
    question: 'Qual a frequência e a duração das sessões?',
    answer:
      'As sessões têm duração média de 50 minutos. A frequência recomendada é semanal, principalmente no início do processo, para garantir continuidade e evolução no seu plano terapêutico.',
  },
];

const faqsOnline: FaqItem[] = [
  {
    question: 'Como funciona a primeira sessão?',
    answer:
      'A primeira sessão é um momento de acolhimento e escuta atenta. Nela, conversamos sobre suas principais queixas, sua história e o que você busca com a terapia. É o espaço para você se sentir à vontade, tirar todas as suas dúvidas e traçarmos juntos os objetivos do seu processo.',
  },
  {
    question: 'Atende por plano de saúde?',
    answer:
      'Não atendo pelo plano, mas você pode pedir reembolso ao seu convênio. Forneço o recibo e os documentos necessários.',
  },
  {
    question: 'Qual o valor da sessão?',
    answer:
      'Os valores são informados diretamente pelo WhatsApp, junto com os horários disponíveis.',
  },
  {
    question: 'Quanto tempo dura a sessão?',
    answer:
      'Cada sessão tem 50 minutos, normalmente com frequência semanal.',
  },
  {
    question: 'Como funcionam as consultas on-line? São seguras e sigilosas?',
    answer:
      'Sim, 100% seguras. As consultas acontecem por videochamada através de plataformas que atendem a todas as resoluções de sigilo e ética do Conselho Federal de Psicologia (CFP). Você só precisa de um ambiente privativo e uma boa conexão com a internet.',
  },
  {
    question: 'O que é a Análise do Comportamento e quais os seus benefícios?',
    answer:
      'A Análise do Comportamento é uma abordagem científica que busca compreender como seus comportamentos, pensamentos e emoções se relacionam com o seu ambiente e sua história de vida. Ela ajuda a identificar gatilhos de ansiedade e estresse para construir estratégias práticas e duradouras de mudança.',
  },
];

export default function FaqAccordion({ onlineOnly = false }: { onlineOnly?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = onlineOnly ? faqsOnline : faqsClassic;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border-t border-warm-300">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-warm-300">
            <button
              onClick={() => toggleAccordion(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="w-full text-left py-5 flex items-start justify-between gap-6 focus:outline-none group cursor-pointer"
            >
              <span className="font-serif text-base sm:text-lg text-slate-900 group-hover:text-brand-700 transition-colors font-medium">
                {faq.question}
              </span>
              <span className="shrink-0 mt-1 text-slate-400 group-hover:text-brand-700 transition-colors">
                {isOpen ? <Minus className="w-5 h-5 text-brand-700" /> : <Plus className="w-5 h-5" />}
              </span>
            </button>

            <div
              id={`faq-answer-${index}`}
              className={`pr-10 text-slate-600 text-sm sm:text-base leading-relaxed ${
                isOpen ? 'block pb-6 animate-fade-in' : 'hidden'
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
