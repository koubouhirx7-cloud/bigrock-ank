import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');
const KV_KEY = 'survey_submissions';

export async function getSubmissions(): Promise<any[]> {
    // Try KV first if configured
    if (process.env.KV_URL) {
        try {
            const data = await kv.get<any[]>(KV_KEY);
            return data || [];
        } catch (error) {
            console.error('KV get error:', error);
        }
    }

    // Fallback to local file
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('File read error:', error);
        }
    }

    return [];
}

export async function saveSubmission(record: any): Promise<boolean> {
    const submissions = await getSubmissions();
    submissions.push(record);

    // Try KV first if configured
    if (process.env.KV_URL) {
        try {
            await kv.set(KV_KEY, submissions);
            return true;
        } catch (error) {
            console.error('KV set error:', error);
        }
    }

    // Fallback to local file (will fail on Vercel but work locally)
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
        return true;
    } catch (error) {
        console.error('File write error:', error);
        throw error; // Rethrow to handle in API
    }
}

export async function deleteSubmission(timestamp: string): Promise<boolean> {
    let submissions = await getSubmissions();
    const initialLength = submissions.length;
    submissions = submissions.filter((s: any) => s.timestamp !== timestamp);

    if (submissions.length === initialLength) {
        return false;
    }

    // Try KV first if configured
    if (process.env.KV_URL) {
        try {
            await kv.set(KV_KEY, submissions);
            return true;
        } catch (error) {
            console.error('KV delete error:', error);
        }
    }

    // Fallback to local file
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
        return true;
    } catch (error) {
        console.error('File write error:', error);
        throw error;
    }
}
