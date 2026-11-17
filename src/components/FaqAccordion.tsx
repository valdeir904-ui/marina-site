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
    question: 'Procura psicólogo ou psicóloga em Ribeirão Preto? Como funciona o primeiro contato?',
    answer:
      'Sou psicóloga e atendo adultos que procuram psicólogo ou psicóloga em Ribeirão Preto, presencialmente no Centro (Rua Bernardino de Campos, 1001) e on-line. No primeiro contato pelo WhatsApp, você tira dúvidas sobre formato, horários e valores, sem compromisso.',
  },
  {
    question: 'O atendimento é presencial ou on-line?',
    answer:
      'Os dois. Presencial no Centro de Ribeirão Preto e on-line por videochamada para todo o Brasil e o exterior. Você escolhe o formato ao agendar.',
  },
  {
    question: 'Onde fica o consultório?',
    answer:
      'Rua Bernardino de Campos, 1001, sala 310, Edifício Fortes Guimarães, Centro de Ribeirão Preto.',
  },
  {
    question: 'Tem estacionamento?',
    answer:
      'Há estacionamentos pagos nas proximidades do edifício.',
  },
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

const faqsPresencial: FaqItem[] = [
  {
    question: 'Onde fica o consultório?',
    answer:
      'O consultório fica na Rua Bernardino de Campos, 1001, sala 310, Edifício Fortes Guimarães, no Centro de Ribeirão Preto/SP (CEP 14015-130). O local possui fácil acesso, portaria e estacionamentos nas proximidades.',
  },
  {
    question: 'Atende por plano de saúde?',
    answer:
      'O atendimento é particular, com nota fiscal e relatório para você solicitar reembolso ao seu plano.',
  },
  {
    question: 'Como funciona o primeiro contato e o agendamento presencial?',
    answer:
      'Se você procura um psicólogo em Ribeirão Preto para atendimento presencial, o primeiro contato é feito diretamente pelo WhatsApp. Conversamos de forma simples e acolhedora para tirar dúvidas, verificar a disponibilidade de horários e agendar sua sessão.',
  },
  {
    question: 'Como é a primeira sessão de psicoterapia presencial?',
    answer:
      'A primeira sessão é um momento dedicado à escuta acolhedora no consultório. Conversamos sobre o que motivou sua busca pela psicoterapia, sua história e seus objetivos. É um espaço de acolhimento seguro, ético e livre de julgamentos.',
  },
  {
    question: 'Qual a duração e a frequência das sessões?',
    answer:
      'Cada sessão presencial tem duração de 50 minutos. A frequência recomendada é semanal para garantir a continuidade e a evolução do acompanhamento clínico.',
  },
  {
    question: 'Tem estacionamento no local ou nas proximidades?',
    answer:
      'O Edifício Fortes Guimarães fica em ponto central com diversas opções de estacionamento rotativo e particular na mesma quadra e ruas adjacentes.',
  },
  {
    question: 'O que é a Análise do Comportamento?',
    answer:
      'A Análise do Comportamento é uma abordagem psicológica fundamentada na ciência. Ela busca compreender as relações entre sentimentos, pensamentos e o ambiente ao seu redor, construindo estratégias práticas para lidar com ansiedade, estresse e conflitos de relacionamento.',
  },
  {
    question: 'Se eu precisar viajar, posso fazer a sessão on-line?',
    answer:
      'Sim. Caso você tenha imprevistos, viagens ou prefira o atendimento remoto em alguma semana, podemos realizar a sessão on-line por videochamada com o mesmo sigilo e qualidade.',
  },
];

interface FaqAccordionProps {
  onlineOnly?: boolean;
  presencialOnly?: boolean;
  customFaqs?: FaqItem[];
}

export default function FaqAccordion({
  onlineOnly = false,
  presencialOnly = false,
  customFaqs,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = customFaqs || (presencialOnly ? faqsPresencial : onlineOnly ? faqsOnline : faqsClassic);

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
