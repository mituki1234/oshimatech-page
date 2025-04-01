import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { id, password } = await request.json();
        const cuurectId = process.env.NEXT_PUBLIC_ID;
        const cuurectPassword = process.env.NEXT_PUBLIC_PASSWORD;
        
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}