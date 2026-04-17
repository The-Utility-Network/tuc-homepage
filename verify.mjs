import { SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';

async function verify() {
  const client = new SESClient({
    region: process.env.SES_REGION || process.env.AWS_REGION || 'us-west-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const res = await client.send(
      new VerifyEmailIdentityCommand({ EmailAddress: 'founders@theutilitycompany.co' })
    );
    console.log('Verification request sent successfully:', res);
  } catch (err) {
    console.error('Failed to send verification request:', err);
  }
}

verify();
