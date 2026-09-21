import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redireciona o root de /admin direto para o dashboard ou login
  redirect('/admin/dashboard');
}
