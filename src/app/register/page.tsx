'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Label } from '@/components/ui';
import { loadCurrentSurvey, saveCustomerRecord, clearCurrentSurvey } from '@/lib/storage';
import { CustomerData, SurveyData } from '@/lib/types';

export default function RegisterPage() {
    const router = useRouter();
    const [surveyData, setSurveyData] = useState<Partial<SurveyData> | null>(null);
    const [formData, setFormData] = useState({
        storeName: '',
        contactName: '',
        email: '',
        phone: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const loaded = loadCurrentSurvey();
        if (!loaded || Object.keys(loaded).length === 0) {
            // If no survey data, maybe redirect back?
        }
        setSurveyData(loaded || {});
    }, []);

    if (!isMounted) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>読み込み中...</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.storeName || !formData.contactName) {
            alert('店舗名とご担当者名は必須です。');
            return;
        }

        setIsSubmitting(true);

        const finalRecord: CustomerData = {
            ...((surveyData as SurveyData) || { interestedProducts: [] }),
            ...formData
        };

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalRecord),
            });

            if (!response.ok) {
                throw new Error('送信に失敗しました。');
            }

            clearCurrentSurvey();
            router.push('/complete');
        } catch (error) {
            console.error(error);
            alert('エラーが発生しました。もう一度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', width: '100%' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>お客様情報登録</h1>

            <form onSubmit={handleSubmit}>
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div>
                        <Label htmlFor="storeName">1. 店舗名 <span style={{ color: 'red' }}>*</span></Label>
                        <Input
                            id="storeName"
                            placeholder="例：サイクルショップ BIGROCK"
                            value={formData.storeName}
                            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="contactName">ご担当者名 <span style={{ color: 'red' }}>*</span></Label>
                        <Input
                            id="contactName"
                            placeholder="例：山田 太郎"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">メールアドレス (任意)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@bigrock.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone">電話番号 (任意)</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="03-1234-5678"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={isSubmitting}>
                            {isSubmitting ? '送信中...' : '登録して完了する'}
                        </Button>
                    </div>

                </Card>
            </form>
        </div>
    );
}
