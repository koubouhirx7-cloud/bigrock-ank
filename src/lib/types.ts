export type FirstImpression = 'Very Good' | 'Good' | 'Normal' | 'Hard to Understand';
export type PriceImpression = 'Appropriate' | 'Slightly High' | 'Slightly Low' | 'Unsure';
export type DealingIntent = 'Positive' | 'Conditional' | 'Info Only';

export interface SurveyData {
    firstImpression?: FirstImpression;
    interestedProducts: string[];
    priceImpression?: PriceImpression;
    dealingIntent?: DealingIntent;
    comments?: string;
}

export interface CustomerData extends SurveyData {
    storeName: string;
    contactName: string;
    email?: string; // Optional but good for registration
    phone?: string; // Optional
}

export const PRODUCTS_LIST = [
    'フレーム',
    '一体型ハンドル（SKYLINE）',
    'ハンドル（BLADE／GRAVEL）',
    'サドル',
    'クランク',
    'アクセサリー類',
];
