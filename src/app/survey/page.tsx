'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Label, Radio, Checkbox, Textarea } from '@/components/ui';
import { PRODUCTS_LIST, SurveyData } from '@/lib/types';
import { saveCurrentSurvey, loadCurrentSurvey } from '@/lib/storage';

export default function SurveyPage() {
    const router = useRouter();
    const [data, setData] = useState<Partial<SurveyData>>({
        interestedProducts: [],
    });

    useEffect(() => {
        const saved = loadCurrentSurvey();
        if (saved) {
            setData(prev => ({ ...prev, ...saved }));
        }
    }, []);

    const handleChange = (field: keyof SurveyData, value: any) => {
        const newData = { ...data, [field]: value };
        setData(newData);
        saveCurrentSurvey(newData);
    };

    const toggleProduct = (product: string) => {
        const current = data.interestedProducts || [];
        const updated = current.includes(product)
            ? current.filter(p => p !== product)
            : [...current, product];
        handleChange('interestedProducts', updated);
    };

    const handleNext = () => {
        // Basic validation could go here
        router.push('/register');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', width: '100%' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>アンケート</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Q2. First Impression */}
                <Card>
                    <Label>2. BIGROCK の第一印象</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {['とても良い', '良い', '普通', '分かりにくい'].map((opt) => (
                            <Radio
                                key={opt}
                                label={opt}
                                name="impression"
                                value={opt}
                                checked={data.firstImpression === opt}
                                onChange={() => handleChange('firstImpression', opt)}
                            />
                        ))}
                    </div>
                </Card>

                {/* Q3. Interested Products */}
                <Card>
                    <Label>3. 特に関心を持った商品（複数可）</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {PRODUCTS_LIST.map((prod) => (
                            <Checkbox
                                key={prod}
                                label={prod}
                                checked={data.interestedProducts?.includes(prod)}
                                onChange={() => toggleProduct(prod)}
                            />
                        ))}
                    </div>
                </Card>

                {/* Q4. Price Impression */}
                <Card>
                    <Label>4. 価格帯の印象</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {['適正', 'やや高い', 'やや安い', '分からない'].map((opt) => (
                            <Radio
                                key={opt}
                                label={opt}
                                name="price"
                                value={opt}
                                checked={data.priceImpression === opt}
                                onChange={() => handleChange('priceImpression', opt)}
                            />
                        ))}
                    </div>
                </Card>

                {/* Q5. Intent */}
                <Card>
                    <Label>5. 取り扱い意向</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {['前向きに検討したい', '条件次第で検討', '今回は情報収集のみ'].map((opt) => (
                            <Radio
                                key={opt}
                                label={opt}
                                name="intent"
                                value={opt}
                                checked={data.dealingIntent === opt}
                                onChange={() => handleChange('dealingIntent', opt)}
                            />
                        ))}
                    </div>
                </Card>

                {/* Q6. Comments */}
                <Card>
                    <Label>6. ご意見・気になった点（任意）</Label>
                    <Textarea
                        rows={4}
                        placeholder="自由にご記入ください"
                        value={data.comments || ''}
                        onChange={(e) => handleChange('comments', e.target.value)}
                    />
                </Card>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Button variant="primary" onClick={handleNext} style={{ width: '100%', maxWidth: '300px' }}>
                        次へ進む
                    </Button>
                </div>

            </div>
        </div>
    );
}
