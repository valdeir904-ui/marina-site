import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1: Burnout -> /images/burnout.png
    await query("UPDATE posts SET image_url = '/images/burnout.png' WHERE slug LIKE '%burnout%'");
    
    // 2: Ansiedade -> /images/blog-ansiedade.png
    await query("UPDATE posts SET image_url = '/images/blog-ansiedade.png' WHERE slug LIKE '%ansiedade%'");
    
    // 3: Luto / Vinculos -> /images/luto.png or blog-relacionamentos.png
    await query("UPDATE posts SET image_url = '/images/luto.png' WHERE slug LIKE '%luto%'");
    await query("UPDATE posts SET image_url = '/images/blog-relacionamentos.png' WHERE slug LIKE '%vinculos%' OR slug LIKE '%relacionamento%' OR slug LIKE '%casal%'");

    // 4: Redes sociais / Instagram
    await query("UPDATE posts SET image_url = '/images/blog-redes-sociais.png' WHERE slug LIKE '%instagram%' OR slug LIKE '%redes-sociais%'");

    // 5: WhatsApp Number
    await query("UPDATE settings SET value = '5516994244626' WHERE key = 'whatsapp_number'");

    return NextResponse.json({ success: true, message: 'Imagens e configurações atualizadas no banco de produção!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
