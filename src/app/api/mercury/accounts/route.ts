import { NextResponse } from 'next/server'

export async function GET() {
    const apiKey = process.env.MERCURY_SECRET_TOKEN

    if (!apiKey) {
        return NextResponse.json({ error: 'Mercury API key not configured' }, { status: 500 })
    }

    try {
        const res = await fetch('https://api.mercury.com/api/v1/accounts', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Mercury API Error:', res.status, errorText)
            return NextResponse.json({ error: `Mercury API Error: ${res.statusText}` }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (err: any) {
        console.error('Mercury API Exception:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
