export function getMedallionUrl(subsidiaryName: string): string {
    const baseUrl = 'https://engram1.blob.core.windows.net/tuc-homepage/Medallions';

    // Normalize name to handle potential variations
    const name = subsidiaryName.toLowerCase().trim();

    const mapping: Record<string, string> = {
        'ledger1': 'Ledger1.png',
        'the graine ledger': 'TGL.png',
        'arthaneeti': 'AR.png',
        'requiem electric': 'RE.png',
        'cornucopia robotics': 'CornucopiaRobotics.png',
        'osiris protocol': 'OP.png',
        'vulcan forge': 'VulcanForge2.png',
        'elysium athletica': 'Elysium.png',
        'the loch ness botanical society': 'TLN.png',
        'digibazaar': 'DigiBazaarMedallion.png',
        'the utility company': 'Symbol.png'
    };

    const filename = mapping[name] || 'Symbol.png'; // Fallback to TUC symbol
    return `${baseUrl}/${filename}`;
}
