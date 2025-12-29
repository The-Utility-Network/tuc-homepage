const MERCURY_API_URL = 'https://api.mercury.com/api/v1';

export async function getMercuryAccounts() {
    const apiKey = process.env.MERCURY_SECRET_TOKEN;

    if (!apiKey) {
        console.error('MERCURY_SECRET_TOKEN is missing');
        return [];
    }

    try {
        const response = await fetch(`${MERCURY_API_URL}/accounts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            next: { revalidate: 60 } // Cache for 1 minute
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Mercury API Error:', response.status, errorText);
            return [];
        }

        const data = await response.json();
        return data.accounts || [];
    } catch (error) {
        console.error('Failed to fetch Mercury accounts:', error);
        return [];
    }
}

export async function getMercuryAccount(accountId: string) {
    // Similar to above but for single account if needed
    // ...
}
