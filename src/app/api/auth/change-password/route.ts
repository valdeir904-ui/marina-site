import { NextResponse } from 'next/server';
import { getSessionUser, comparePassword, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado. Faça login novamente.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Senha atual e nova senha são obrigatórias.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
    }

    // Busca o usuário no banco de dados para pegar a senha hash atual
    const users = await query('SELECT password FROM users WHERE email = ?', [user.email]);
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    const dbPasswordHash = users[0].password;

    // Compara a senha atual enviada com o hash no banco
    const isPasswordCorrect = await comparePassword(currentPassword, dbPasswordHash);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'A senha atual está incorreta.' }, { status: 401 });
    }

    // Gera o hash para a nova senha e atualiza no banco
    const newHashedPassword = await hashPassword(newPassword);
    
    await query('UPDATE users SET password = ? WHERE email = ?', [newHashedPassword, user.email]);

    return NextResponse.json({ success: true, message: 'Senha atualizada com sucesso.' });

  } catch (error: any) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ error: 'Ocorreu um erro interno ao tentar alterar a senha.' }, { status: 500 });
  }
}
