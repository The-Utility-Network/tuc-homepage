/**
 * Document Generator
 * Generates legal documents from templates with variable substitution
 * Supports both LaTeX and HTML-based generation
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export type DocumentType = 'subscription' | 'safe' | 'nda' | 'stock_purchase' | 'investor_rights'

export interface DocumentVariables {
    // Common variables
    ENTITY_NAME: string
    ENTITY_STATE: string
    DATE: string
    INVESTOR_NAME: string
    INVESTOR_ADDRESS?: string
    COMPANY_SIGNATORY_NAME: string
    COMPANY_SIGNATORY_TITLE: string
    GOVERNING_LAW_STATE: string

    // Subscription Agreement specific
    ROUND_NAME?: string
    SECURITY_TYPE?: string
    SHARE_COUNT?: string
    SHARE_PRICE?: string
    INVESTMENT_AMOUNT: string
    PAYMENT_DEADLINE?: string
    ACCREDITATION_REASON?: string
    PRE_MONEY_VALUATION?: string
    CLOSING_DATE?: string

    // SAFE specific
    PURCHASE_AMOUNT?: string
    VALUATION_CAP?: string
    DISCOUNT_RATE?: string
    TERMINATION_YEARS?: string

    // NDA specific
    RECIPIENT_NAME?: string
    TERM_YEARS?: string
}

/**
 * Load LaTeX template from file
 */
async function loadLatexTemplate(templateType: DocumentType): Promise<string> {
    const templateMap: Record<DocumentType, string> = {
        'subscription': '/src/lib/latex-templates/subscription_agreement.tex',
        'safe': '/src/lib/latex-templates/safe_agreement.tex',
        'nda': '/src/lib/latex-templates/nda.tex',
        'stock_purchase': '/src/lib/latex-templates/subscription_agreement.tex', // Reuse for now
        'investor_rights': '/src/lib/latex-templates/subscription_agreement.tex', // Reuse for now
    }

    const templatePath = templateMap[templateType]

    try {
        const response = await fetch(templatePath)
        if (!response.ok) {
            throw new Error(`Failed to load template: ${templatePath}`)
        }
        return await response.text()
    } catch (error) {
        console.error('Error loading LaTeX template:', error)
        throw error
    }
}

/**
 * Substitute variables in template
 */
export function substituteVariables(template: string, variables: DocumentVariables): string {
    let result = template

    // Replace all {{VARIABLE}} placeholders
    Object.entries(variables).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            const regex = new RegExp(`{{${key}}}`, 'g')
            result = result.replace(regex, String(value))
        }
    })

    // Replace any remaining placeholders with empty string or default
    result = result.replace(/{{[A-Z_]+}}/g, '___________')

    return result
}

/**
 * Generate PDF from HTML (for now, simpler than LaTeX compilation)
 * This creates a professional-looking legal document
 */
export async function generateHtmlDocument(
    documentType: DocumentType,
    variables: DocumentVariables
): Promise<string> {
    const templates: Record<DocumentType, (vars: DocumentVariables) => string> = {
        'subscription': generateSubscriptionHtml,
        'safe': generateSafeHtml,
        'nda': generateNdaHtml,
        'stock_purchase': generateSubscriptionHtml,
        'investor_rights': generateSubscriptionHtml,
    }

    const generator = templates[documentType]
    if (!generator) {
        throw new Error(`Unknown document type: ${documentType}`)
    }

    return generator(variables)
}

function generateSubscriptionHtml(vars: DocumentVariables): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Subscription Agreement</title>
    <style>
        @page { size: letter; margin: 1in; }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        .header {
            text-align: center;
            margin-bottom: 2cm;
            border-bottom: 2px solid #000;
            padding-bottom: 0.5cm;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }
        .subtitle {
            font-size: 14pt;
            margin-top: 0.3cm;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 1.5cm;
            margin-bottom: 0.5cm;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 1cm;
            margin-bottom: 0.3cm;
        }
        .parties {
            margin: 1cm 0;
            line-height: 2;
        }
        .signature-block {
            display: flex;
            justify-content: space-between;
            margin-top: 3cm;
            page-break-inside: avoid;
        }
        .signature-box {
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid #000;
            width: 100%;
            margin: 2cm 0 0.3cm 0;
        }
        .bold {
            font-weight: bold;
        }
        .amount {
            font-weight: bold;
            text-decoration: underline;
        }
        ul, ol {
            margin-left: 1.5cm;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Subscription Agreement</h1>
        <div class="subtitle">For ${vars.ROUND_NAME || 'Series A'} Financing</div>
    </div>

    <div class="parties">
        This Subscription Agreement (this "Agreement") is entered into as of <span class="bold">${vars.DATE}</span>, by and between:
        <br><br>
        <span class="bold">${vars.ENTITY_NAME}</span> (the "Company"), a corporation organized and existing under the laws of ${vars.ENTITY_STATE}, and
        <br><br>
        <span class="bold">${vars.INVESTOR_NAME}</span> (the "Investor")${vars.INVESTOR_ADDRESS ? `, residing at ${vars.INVESTOR_ADDRESS}` : ''}.
    </div>

    <h2>1. Subscription</h2>
    <p>
        The Investor hereby subscribes for and agrees to purchase from the Company, and the Company hereby agrees to sell and issue to the Investor, ${vars.SHARE_COUNT || '___'} shares (the "Shares") of the Company's ${vars.SECURITY_TYPE || 'Preferred Stock'} at a purchase price of $${vars.SHARE_PRICE || '___'} per share, for an aggregate purchase price of <span class="amount">$${vars.INVESTMENT_AMOUNT}</span> (the "Purchase Price").
    </p>

    <h2>2. Payment</h2>
    <p>
        The Investor shall pay the Purchase Price to the Company by wire transfer, check, or other method acceptable to the Company on or before ${vars.PAYMENT_DEADLINE || '_______________'}.
    </p>

    <h2>3. Representations and Warranties of the Investor</h2>
    <p>The Investor hereby represents and warrants to the Company as follows:</p>

    <h3>3.1 Authority</h3>
    <p>
        The Investor has full power and authority to enter into this Agreement and to consummate the transactions contemplated hereby.
    </p>

    <h3>3.2 Investment Intent</h3>
    <p>
        The Investor is acquiring the Shares for investment purposes only and not with a view to, or for resale in connection with, any distribution thereof.
    </p>

    <h3>3.3 Accredited Investor Status</h3>
    <p>
        The Investor is an "accredited investor" as defined in Rule 501 of Regulation D promulgated under the Securities Act of 1933, as amended (the "Securities Act"), by virtue of:
    </p>
    <ul>
        <li>${vars.ACCREDITATION_REASON || 'Meeting the income/net worth requirements set forth in Rule 501'}</li>
    </ul>

    <h3>3.4 Experience and Sophistication</h3>
    <p>
        The Investor has such knowledge, sophistication, and experience in business and financial matters so as to be capable of evaluating the merits and risks of the prospective investment in the Shares.
    </p>

    <h3>3.5 Risk Acknowledgment</h3>
    <p>
        The Investor understands that the purchase of the Shares involves substantial risk and has determined that the Shares are a suitable investment for the Investor, and the Investor is able to bear the economic risk of losing the Investor's entire investment.
    </p>

    <h2>4. Representations and Warranties of the Company</h2>
    <p>The Company hereby represents and warrants to the Investor as follows:</p>

    <h3>4.1 Organization and Good Standing</h3>
    <p>
        The Company is a corporation duly organized, validly existing, and in good standing under the laws of ${vars.ENTITY_STATE}.
    </p>

    <h3>4.2 Authorization</h3>
    <p>
        The execution, delivery, and performance of this Agreement by the Company have been duly authorized by all necessary corporate action.
    </p>

    <h3>4.3 Valuation</h3>
    <p>
        The pre-money valuation of the Company for this financing round is $${vars.PRE_MONEY_VALUATION || '_______________'}.
    </p>

    <h2>5. Closing</h2>
    <p>
        The closing of the purchase and sale of the Shares (the "Closing") shall take place remotely via electronic exchange of documents and signatures on or before ${vars.CLOSING_DATE || '_______________'}.
    </p>

    <h2>6. Governing Law</h2>
    <p>
        This Agreement shall be governed by and construed in accordance with the laws of the State of ${vars.GOVERNING_LAW_STATE}, without regard to conflicts of law principles.
    </p>

    <h2>7. Entire Agreement</h2>
    <p>
        This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements and understandings, both written and oral, between the parties with respect to such subject matter.
    </p>

    <h2>8. Amendments</h2>
    <p>
        This Agreement may not be amended except by a written instrument signed by both parties.
    </p>

    <div style="margin-top: 2cm;">
        <p><span class="bold">IN WITNESS WHEREOF</span>, the parties have executed this Agreement as of the date first written above.</p>
    </div>

    <div class="signature-block">
        <div class="signature-box">
            <div class="bold">COMPANY:</div>
            <div>${vars.ENTITY_NAME}</div>
            <div class="signature-line"></div>
            <div>By: ${vars.COMPANY_SIGNATORY_NAME}</div>
            <div>Title: ${vars.COMPANY_SIGNATORY_TITLE}</div>
            <div>Date: _________________</div>
        </div>
        <div class="signature-box">
            <div class="bold">INVESTOR:</div>
            <div class="signature-line"></div>
            <div>Signature: ${vars.INVESTOR_NAME}</div>
            <div>Date: _________________</div>
        </div>
    </div>
</body>
</html>
`
}

function generateSafeHtml(vars: DocumentVariables): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SAFE Agreement</title>
    <style>
        @page { size: letter; margin: 1in; }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        .header {
            text-align: center;
            margin-bottom: 2cm;
            border-bottom: 2px solid #000;
            padding-bottom: 0.5cm;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }
        .subtitle {
            font-size: 12pt;
            margin-top: 0.3cm;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 1.5cm;
            margin-bottom: 0.5cm;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 1cm;
            margin-bottom: 0.3cm;
        }
        .signature-block {
            display: flex;
            justify-content: space-between;
            margin-top: 3cm;
            page-break-inside: avoid;
        }
        .signature-box {
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid #000;
            width: 100%;
            margin: 2cm 0 0.3cm 0;
        }
        .bold {
            font-weight: bold;
        }
        .amount {
            font-weight: bold;
            text-decoration: underline;
        }
        ol, ul {
            margin-left: 1.5cm
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Simple Agreement for Future Equity</h1>
        <div class="subtitle">(Valuation Cap, No Discount)</div>
    </div>

    <p style="margin: 2cm 0;">
        THIS CERTIFIES THAT in exchange for the payment by <span class="bold">${vars.INVESTOR_NAME}</span> (the "Investor") of <span class="amount">$${vars.PURCHASE_AMOUNT || vars.INVESTMENT_AMOUNT}</span> (the "Purchase Amount") on or about ${vars.DATE}, <span class="bold">${vars.ENTITY_NAME}</span>, a ${vars.ENTITY_STATE} corporation (the "Company"), issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms described below.
    </p>

    <h2>1. Events</h2>

    <h3>1.1 Equity Financing</h3>
    <p>
        If there is an Equity Financing before the termination of this Safe, on the initial closing of such Equity Financing, this Safe will automatically convert into the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Conversion Price.
    </p>
    <p>
        The "Conversion Price" is the Safe Price, which is the price per share equal to the Valuation Cap divided by the Company Capitalization.
    </p>
    <p>
        The <span class="bold">Valuation Cap</span> is <span class="amount">$${vars.VALUATION_CAP || '_______________'}</span>.
    </p>

    <h3>1.2 Liquidity Event</h3>
    <p>
        If there is a Liquidity Event before the termination of this Safe, this Safe will automatically be entitled to receive a portion of Proceeds, due and payable to the Investor immediately prior to, or concurrent with, the consummation of such Liquidity Event, equal to the greater of:
    </p>
    <ol>
        <li>the Purchase Amount (the "Cash-Out Amount"), or</li>
        <li>the amount payable on the number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price (the "Conversion Amount").</li>
    </ol>

    <h3>1.3 Dissolution Event</h3>
    <p>
        If there is a Dissolution Event before the termination of this Safe, the Investor will automatically be entitled to receive a portion of Proceeds equal to the Cash-Out Amount, due and payable to the Investor immediately prior to the consummation of the Dissolution Event.
    </p>

    <h3>1.4 Termination</h3>
    <p>This Safe will expire and terminate upon the earlier of:</p>
    <ol>
        <li>the issuance of Capital Stock to the Investor pursuant to the conversion;</li>
        <li>the payment of amounts due the Investor; or</li>
        <li>the expiration of ${vars.TERMINATION_YEARS || '5'} years from the date of this Safe.</li>
    </ol>

    <h2>2. Definitions</h2>
    <p>
        <span class="bold">"Capital Stock"</span> means the capital stock of the Company, including the Common Stock and Preferred Stock.
    </p>
    <p>
        <span class="bold">"Equity Financing"</span> means a bona fide transaction or series of transactions with the principal purpose of raising capital, pursuant to which the Company issues and sells Preferred Stock at a fixed pre-money valuation.
    </p>

    <h2>3. Company Representations</h2>
    <p>The Company represents and warrants that:</p>
    <ol>
        <li>The Company is a corporation duly organized, validly existing and in good standing under the laws of ${vars.ENTITY_STATE}.</li>
        <li>The execution, delivery and performance by the Company of this Safe is within the power of the Company.</li>
        <li>This Safe constitutes a legal, valid and binding obligation of the Company.</li>
    </ol>

    <h2>4. Investor Representations</h2>
    <p>The Investor represents and warrants that:</p>
    <ol>
        <li>The Investor is acquiring this Safe for investment purposes only.</li>
        <li>The Investor is an accredited investor as defined in Rule 501 of Regulation D.</li>
        <li>The Investor understands this Safe has not been registered and may not be resold unless registered or an exemption is available.</li>
    </ol>

    <h2>5. Miscellaneous</h2>
    <h3>5.1 Governing Law</h3>
    <p>
        This Safe will be governed by the laws of the State of ${vars.GOVERNING_LAW_STATE}.
    </p>

    <h3>5.2 Entire Agreement</h3>
    <p>
        This Safe constitutes the entire agreement between the parties.
    </p>

    <div style="margin-top: 2cm;">
        <p><span class="bold">IN WITNESS WHEREOF</span>, the undersigned have caused this Safe to be executed as of ${vars.DATE}.</p>
    </div>

    <div class="signature-block">
        <div class="signature-box">
            <div class="bold">COMPANY:</div>
            <div>${vars.ENTITY_NAME}</div>
            <div class="signature-line"></div>
            <div>By: ${vars.COMPANY_SIGNATORY_NAME}</div>
            <div>Title: ${vars.COMPANY_SIGNATORY_TITLE}</div>
        </div>
        <div class="signature-box">
            <div class="bold">INVESTOR:</div>
            <div class="signature-line"></div>
            <div>${vars.INVESTOR_NAME}</div>
        </div>
    </div>
</body>
</html>
`
}

function generateNdaHtml(vars: DocumentVariables): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Non-Disclosure Agreement</title>
    <style>
        @page { size: letter; margin: 1in; }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        .header {
            text-align: center;
            margin-bottom: 2cm;
            border-bottom: 2px solid #000;
            padding-bottom: 0.5cm;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 1.5cm;
            margin-bottom: 0.5cm;
        }
        .signature-block {
            display: flex;
            justify-content: space-between;
            margin-top: 3cm;
        }
        .signature-box {
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid #000;
            width: 100%;
            margin: 2cm 0 0.3cm 0;
        }
        ol { margin-left: 1.5cm; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Non-Disclosure Agreement</h1>
    </div>

    <p style="margin: 1cm 0;">
        This Non-Disclosure Agreement ("Agreement") is entered into as of <strong>${vars.DATE}</strong>, by and between <strong>${vars.ENTITY_NAME}</strong> ("Disclosing Party") and <strong>${vars.RECIPIENT_NAME || vars.INVESTOR_NAME}</strong> ("Receiving Party").
    </p>

    <h2>1. Purpose</h2>
    <p>
        The parties wish to explore a business opportunity of mutual interest and, in connection therewith, may disclose certain confidential information.
    </p>

    <h2>2. Confidential Information</h2>
    <p>
        "Confidential Information" means any information disclosed by either party, including business plans, financial information, and investor information.
    </p>

    <h2>3. Non-Disclosure Obligations</h2>
    <p>The Receiving Party agrees:</p>
    <ol>
        <li>to hold the Confidential Information in strict confidence;</li>
        <li>not to disclose Confidential Information to third parties;</li>
        <li>not to use the Confidential Information except for the stated Purpose; and</li>
        <li>to protect it with at least reasonable care.</li>
    </ol>

    <h2>4. Exceptions</h2>
    <p>Obligations do not apply to information that:</p>
    <ol>
        <li>was already known prior to disclosure;</li>
        <li>is publicly available through no breach;</li>
        <li>is rightfully received from a third party;</li>
        <li>is independently developed; or</li>
        <li>must be disclosed by law.</li>
    </ol>

    <h2>5. Term</h2>
    <p>
        This Agreement shall remain in effect for ${vars.TERM_YEARS || '3'} years from execution.
    </p>

    <h2>6. Governing Law</h2>
    <p>
        This Agreement shall be governed by the laws of the State of ${vars.GOVERNING_LAW_STATE}.
    </p>

    <div class="signature-block">
        <div class="signature-box">
            <div><strong>DISCLOSING PARTY:</strong></div>
            <div>${vars.ENTITY_NAME}</div>
            <div class="signature-line"></div>
            <div>Name: ${vars.COMPANY_SIGNATORY_NAME}</div>
            <div>Title: ${vars.COMPANY_SIGNATORY_TITLE}</div>
        </div>
        <div class="signature-box">
            <div><strong>RECEIVING PARTY:</strong></div>
            <div class="signature-line"></div>
            <div>Name: ${vars.RECIPIENT_NAME || vars.INVESTOR_NAME}</div>
        </div>
    </div>
</body>
</html>
`
}

/**
 * Generate document metadata
 */
export function generateDocumentMetadata(documentType: DocumentType, variables: DocumentVariables) {
    return {
        id: crypto.randomUUID(),
        type: documentType,
        createdAt: new Date().toISOString(),
        investor: variables.INVESTOR_NAME,
        company: variables.ENTITY_NAME,
        amount: variables.INVESTMENT_AMOUNT || variables.PURCHASE_AMOUNT,
    }
}
