import { SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verify() {
  const client = new SESClient({
    region: process.env.AWS_REGION || process.env.SES_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
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
