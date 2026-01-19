import { Button } from '@/components/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', background: 'linear-gradient(to bottom right, #000000, #1a1a1a)' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.05em', background: 'linear-gradient(to right, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          BIGROCK
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#888', marginBottom: '3rem' }}>
          展示会へお越しいただき<br />ありがとうございます
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
            今後の製品・販売体制改善のため、<br />アンケートにご協力をお願いいたします。
          </p>

          <Link href="/survey">
            <Button variant="primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.25rem' }}>
              アンケートに回答する
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
