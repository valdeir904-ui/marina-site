import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const posts = [
      {
        title: 'Como lidar com a ansiedade no ambiente de trabalho',
        slug: 'como-lidar-com-ansiedade-no-trabalho',
        summary: 'A ansiedade no ambiente corporativo é cada vez mais comum. Descubra algumas estratégias práticas para gerenciar o estresse e manter o equilíbrio emocional durante o expediente.',
        content: '<p>O ambiente de trabalho moderno pode ser uma fonte significativa de estresse e ansiedade. Prazos apertados, altas expectativas e a pressão constante por resultados podem sobrecarregar até os profissionais mais resilientes.</p><h2>Identificando os Gatilhos</h2><p>O primeiro passo para gerenciar a ansiedade no trabalho é identificar o que a desencadeia. Pode ser uma reunião com a diretoria, o excesso de e-mails ou a falta de clareza nas tarefas.</p><h2>Estratégias Práticas</h2><ul><li><strong>Pausas Estratégicas:</strong> Faça pequenas pausas a cada hora para respirar e se desconectar da tela.</li><li><strong>Organização:</strong> Utilize ferramentas de gestão de tempo para evitar o acúmulo de tarefas de última hora.</li><li><strong>Comunicação Assertiva:</strong> Não tenha medo de pedir ajuda ou negociar prazos quando necessário.</li></ul><p>Lembre-se: cuidar da sua saúde mental é tão importante quanto o seu desempenho profissional.</p>',
        category: 'Ansiedade',
        image_url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1470&auto=format&fit=crop',
        published: 1,
        featured: 1
      },
      {
        title: 'Os sinais silenciosos do Burnout',
        slug: 'sinais-silenciosos-do-burnout',
        summary: 'O Burnout não acontece da noite para o dia. Aprenda a reconhecer os primeiros sinais de esgotamento profissional antes que ele afete todas as áreas da sua vida.',
        content: '<p>A Síndrome de Burnout tem se tornado uma epidemia silenciosa no mundo corporativo. Diferente do cansaço comum, o Burnout é um estado de exaustão física, emocional e mental crônica.</p><h2>Sinais de Alerta</h2><p>Muitas pessoas ignoram os sinais iniciais, acreditando que é apenas "uma semana ruim". Preste atenção se você:</p><ul><li>Sente-se exausto mesmo após uma noite inteira de sono;</li><li>Perdeu o entusiasmo por projetos que antes adorava;</li><li>Tem se isolado dos colegas de trabalho;</li><li>Apresenta sintomas físicos como dores de cabeça ou problemas gástricos frequentes.</li></ul><h2>O Caminho para a Recuperação</h2><p>Reconhecer o Burnout é o primeiro passo para a cura. A terapia focada na Análise do Comportamento pode ajudar a reestruturar a forma como você se relaciona com o trabalho e a estabelecer limites saudáveis.</p>',
        category: 'Burnout',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop',
        published: 1,
        featured: 0
      },
      {
        title: 'A importância da Terapia de Casal antes da crise',
        slug: 'importancia-terapia-casal-antes-crise',
        summary: 'Muitos casais procuram ajuda apenas quando o relacionamento está por um fio. Entenda por que a terapia de casal preventiva pode fortalecer ainda mais o seu vínculo.',
        content: '<p>A terapia de casal frequentemente é vista como o "último recurso" antes do divórcio. No entanto, buscar ajuda profissional quando as coisas ainda estão relativamente bem pode ser uma das melhores decisões para o futuro do relacionamento.</p><h2>Prevenção e Fortalecimento</h2><p>Na terapia de casal preventiva, trabalhamos a <strong>comunicação</strong> e o <strong>alinhamento de expectativas</strong>. É o momento ideal para discutir temas como finanças, planos de carreira e criação de filhos, sem a carga emocional de uma crise instalada.</p><h2>Benefícios de Começar Cedo</h2><ul><li>Criação de um espaço seguro para conversas difíceis;</li><li>Aprendizado de técnicas de resolução de conflitos;</li><li>Fortalecimento da intimidade e da parceria.</li></ul><p>Não espere o balão estourar. Investir no seu relacionamento hoje é garantir um futuro mais tranquilo a dois.</p>',
        category: 'Relacionamentos',
        image_url: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1470&auto=format&fit=crop',
        published: 1,
        featured: 1
      }
    ];

    for (const post of posts) {
      // Check if exists
      const existing = await query('SELECT id FROM posts WHERE slug = ?', [post.slug]);
      if (existing.length === 0) {
        await query(
          'INSERT INTO posts (title, slug, summary, content, category, image_url, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [post.title, post.slug, post.summary, post.content, post.category, post.image_url, post.published, post.featured]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Posts inseridos com sucesso!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
