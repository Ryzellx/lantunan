import type { Metadata } from 'next';
import FaqList from '@/components/FaqList';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Varian, akun, unduhan offline, pembaruan, dan data: pertanyaan yang benar-benar ditanyakan.',
};

export default function FaqPage() {
  return (
    <section className="wrap section">
      <h1>Pertanyaan</h1>
      <p className="muted">Enam hal yang paling sering ditanyakan sebelum memasang Lantunan.</p>
      <FaqList />
    </section>
  );
}
