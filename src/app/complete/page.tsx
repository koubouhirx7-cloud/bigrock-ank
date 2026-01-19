import Link from 'next/link';
import { Button } from '@/components/ui';

export default function CompletePage() {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
                <h1 style={{ marginBottom: '1.5rem', color: '#3b82f6' }}>登録完了</h1>
                <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '3rem', lineHeight: 1.6 }}>
                    ご協力ありがとうございました。<br />
                    今後とも BIGROCK をよろしくお願いいたします。
                </p>

                <Link href="/">
                    <Button variant="outline" style={{ minWidth: '200px' }}>
                        トップへ戻る
                    </Button>
                </Link>
            </div>
        </div>
    );
}
