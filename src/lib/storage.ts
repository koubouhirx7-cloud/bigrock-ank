import { CustomerData, SurveyData } from './types';

const STORAGE_KEY_CURRENT = 'bigrock_current_survey';
const STORAGE_KEY_DB = 'bigrock_db';

// Save current progress (temporary)
export function saveCurrentSurvey(data: Partial<SurveyData>) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(data));
}

// Load current progress
export function loadCurrentSurvey(): Partial<SurveyData> | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEY_CURRENT);
    return data ? JSON.parse(data) : null;
}

// clear current
export function clearCurrentSurvey() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_CURRENT);
}

// Save completed record to "Database"
export function saveCustomerRecord(record: CustomerData) {
    if (typeof window === 'undefined') return;
    const existing = getCustomerRecords();
    const updated = [...existing, { ...record, timestamp: new Date().toISOString() }];
    localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(updated));
}

// Get all records (for Admin)
export function getCustomerRecords(): (CustomerData & { timestamp?: string })[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY_DB);
    return data ? JSON.parse(data) : [];
}
