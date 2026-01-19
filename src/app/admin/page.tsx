'use client';

import { useState, useEffect } from 'react';
import { getCustomerRecords } from '@/lib/storage';
import { CustomerData } from '@/lib/types';
import { Card } from '@/components/ui';

export default function AdminPage() {
    const [records, setRecords] = useState<(CustomerData & { timestamp?: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch('/api/admin');
                if (response.ok) {
                    const data = await response.json();
                    setRecords(data);
                }
            } catch (error) {
                console.error('Failed to fetch records:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>管理ダッシュボード</h1>
                <span style={{ color: '#888' }}>合計: {records.length}件</span>
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
                                    {rec.timestamp ? new Date(rec.timestamp).toLocaleString() : '-'}
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
