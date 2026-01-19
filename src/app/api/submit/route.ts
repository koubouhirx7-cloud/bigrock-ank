import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSubmissions, deleteSubmission } from '@/lib/kv_storage';
import { CustomerData } from '@/lib/types';
import { saveSubmission } from '@/lib/kv_storage';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const record = {
            ...body,
            timestamp: new Date().toISOString(),
        };

        await saveSubmission(record);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save submission' }, { status: 500 });
    }
}
