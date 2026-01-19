import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function GET(request: Request) {
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD || 'bigrock2026';

    if (password !== adminPassword) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json([]);
        }

        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const submissions = JSON.parse(data);

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
        const { timestamp } = await request.json();
        if (!timestamp) {
            return NextResponse.json({ success: false, error: 'Timestamp is required' }, { status: 400 });
        }

        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json({ success: false, error: 'No data file found' }, { status: 404 });
        }

        const data = fs.readFileSync(DATA_FILE, 'utf8');
        let submissions = JSON.parse(data);

        const initialLength = submissions.length;
        submissions = submissions.filter((s: any) => s.timestamp !== timestamp);

        if (submissions.length === initialLength) {
            return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin delete error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete submission' }, { status: 500 });
    }
}
