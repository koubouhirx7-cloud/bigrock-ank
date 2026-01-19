import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSubmissions, deleteSubmission } from '@/lib/kv_storage';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function GET(request: Request) {
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD || 'bigrock2026';

    if (password !== adminPassword) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const submissions = await getSubmissions();
        return NextResponse.json(submissions);
    } catch (error) {
        console.error('Admin fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD || 'bigrock2026';

    if (password !== adminPassword) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
        }

        const { timestamp } = body;
        if (!timestamp) {
            return NextResponse.json({ success: false, error: 'Timestamp is required' }, { status: 400 });
        }

        const success = await deleteSubmission(timestamp);

        if (!success) {
            return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Admin delete error:', error);
        return NextResponse.json({ success: false, error: `Internal server error: ${error.message}` }, { status: 500 });
    }
}
