import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CustomerData } from '@/lib/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const record = {
            ...body,
            timestamp: new Date().toISOString(),
        };

        let submissions: any[] = [];

        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            submissions = JSON.parse(data);
        }

        submissions.push(record);

        // Ensure directory exists (redundant but safe)
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save submission' }, { status: 500 });
    }
}
