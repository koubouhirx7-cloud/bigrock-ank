'use client';

import { useState, useEffect } from 'react';
import { CustomerData } from '@/lib/types';
import { Card, Button, Input, Label } from '@/components/ui';

export default function AdminPage() {
    const [records, setRecords] = useState<(CustomerData & { timestamp?: string })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');

    const fetchRecords = async (pw: string) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin', {
                headers: {
                    'x-admin-password': pw
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRecords(data);
                setIsAuthenticated(true);
                localStorage.setItem('admin_password', pw);
            } else if (response.status === 401) {
                setError('パスワードが正しくありません。');
            } else {
                setError('データの取得に失敗しました。');
            }
        } catch (error) {
            console.error('Failed to fetch records:', error);
            setError('エラーが発生しました。');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const savedPw = localStorage.getItem('admin_password');
        if (savedPw) {
            setPassword(savedPw);
            fetchRecords(savedPw);
        }
    }, []);

    const handleExport = () => {
        if (records.length === 0) return;

        const headers = ['投稿日時', '店舗名', 'ご担当者名', '第一印象', '価格感', '取り扱い意向', '関心商品', 'コメント', 'メールアドレス', '電話番号'];
        const rows = records.map(rec => [
            rec.timestamp ? new Date(rec.timestamp).toLocaleString() : '',
            rec.storeName || '',
            rec.contactName || '',
            rec.firstImpression || '',
            rec.priceImpression || '',
            rec.dealingIntent || '',
            rec.interestedProducts?.join('; ') || '',
            rec.comments?.replace(/\n/g, ' ') || '',
            rec.email || '',
            rec.phone || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `bigrock_survey_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.appendChild(link);
        document.body.removeChild(link);
    };

    const handleDelete = async (timestamp: string) => {
        if (!window.confirm('このデータを削除してもよろしいですか？')) return;

        try {
            const response = await fetch('/api/admin', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': password
                },
                body: JSON.stringify({ timestamp })
            });

            if (response.ok) {
                setRecords(prev => prev.filter(r => r.timestamp !== timestamp));
            } else {
                alert('削除に失敗しました。');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('エラーが発生しました。');
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecords(password);
    };

    if (!isAuthenticated) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '1rem' }}>
                <Card style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>管理者ログイン</h1>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <Label htmlFor="admin-password">パスワード</Label>
                            <Input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="入力を入力"
                                required
                            />
                        </div>
                        {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem' }}>{error}</p>}
                        <Button type="submit" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
                            {isLoading ? '認証中...' : 'ログイン'}
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>管理ダッシュボード</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#888' }}>合計: {records.length}件</span>
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                        disabled={records.length === 0}
                    >
                        Excelで出力
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            localStorage.removeItem('admin_password');
                            setIsAuthenticated(false);
                            setRecords([]);
                            setPassword('');
                        }}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                    >
                        ログアウト
                    </Button>
                </div>
            </header>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {isLoading ? (
                    <p style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>読み込み中...</p>
                ) : records.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>データがありません</p>
                ) : (
                    records.slice().reverse().map((rec, idx) => (
                        <Card key={idx} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem' }}>{rec.storeName}</h3>
                                    <p style={{ color: '#888', fontSize: '0.9rem' }}>{rec.contactName}</p>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>
                                    {rec.timestamp && (
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            {new Date(rec.timestamp).toLocaleString()}
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => rec.timestamp && handleDelete(rec.timestamp)}
                                        style={{ color: '#ff4d4d', borderColor: '#ff4d4d', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                                    >
                                        削除
                                    </Button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                <div>
                                    <strong style={{ color: '#aaa' }}>第一印象:</strong> {rec.firstImpression || '-'}
                                </div>
                                <div>
                                    <strong style={{ color: '#aaa' }}>価格感:</strong> {rec.priceImpression || '-'}
                                </div>
                                <div>
                                    <strong style={{ color: '#aaa' }}>意向:</strong> {rec.dealingIntent || '-'}
                                </div>
                                <div>
                                    <strong style={{ color: '#aaa' }}>関心商品:</strong> {rec.interestedProducts?.join(', ') || 'なし'}
                                </div>
                            </div>

                            {rec.comments && (
                                <div style={{ marginTop: '1rem', background: '#222', padding: '0.75rem', borderRadius: '4px' }}>
                                    <strong style={{ color: '#aaa', display: 'block', marginBottom: '0.25rem' }}>コメント:</strong>
                                    {rec.comments}
                                </div>
                            )}

                            {(rec.email || rec.phone) && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                    {rec.email && <span>Email: {rec.email} </span>}
                                    {rec.phone && <span>Tel: {rec.phone}</span>}
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
