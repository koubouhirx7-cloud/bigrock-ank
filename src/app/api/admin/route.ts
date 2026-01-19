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

        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json({ success: false, error: 'Data file not found on server' }, { status: 404 });
        }

        const data = fs.readFileSync(DATA_FILE, 'utf8');
        let submissions = JSON.parse(data);

        const initialLength = submissions.length;
        submissions = submissions.filter((s: any) => s.timestamp !== timestamp);

        if (submissions.length === initialLength) {
            return NextResponse.json({ success: false, error: 'Record not found in the list' }, { status: 404 });
        }

        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
        } catch (e: any) {
            console.error('File write error:', e);
            // This is the common failure point on Vercel
            return NextResponse.json({
                success: false,
                error: `Server file system is read-only (EROFS). Persisting changes is not possible in this environment without a database. Message: ${e.message}`
            }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Admin delete error:', error);
        return NextResponse.json({ success: false, error: `Internal server error: ${error.message}` }, { status: 500 });
    }
}
