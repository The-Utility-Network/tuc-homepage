import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Ensure the SES client uses the configuration from the environment payload
const sesClient = new SESClient({
    region: process.env.SES_REGION || process.env.AWS_REGION || 'us-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const FROM_ADDRESS = process.env.SES_FROM_ADDRESS || 'The Utility Network <founders@theutilitycompany.co>';

interface SendEmailOptions {
    toAddresses: string[];
    subject: string;
    htmlBody: string;
    textBody?: string;
    replyToAddresses?: string[];
}

export async function sendEmail({
    toAddresses,
    subject,
    htmlBody,
    textBody,
    replyToAddresses = [],
}: SendEmailOptions) {
    try {
        const command = new SendEmailCommand({
            Destination: {
                ToAddresses: toAddresses,
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: htmlBody,
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: textBody || htmlBody.replace(/<[^>]*>?/gm, ''), // Fallback stripping HTML if no explicit text body
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
            },
            Source: FROM_ADDRESS,
            ReplyToAddresses: replyToAddresses.length > 0 ? replyToAddresses : [FROM_ADDRESS.match(/<([^>]+)>/)?.[1] || FROM_ADDRESS],
        });

        const response = await sesClient.send(command);
        console.log(`[AWS SES] Email successfully sent to ${toAddresses.join(', ')}. MessageId: ${response.MessageId}`);
        return response;
    } catch (error) {
        console.error('[AWS SES] Failed to send email:', error);
        throw error;
    }
}
