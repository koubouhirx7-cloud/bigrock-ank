import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function GET() {
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
