import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID;

if (!clientId) {
    throw new Error("No ThirdWeb Client ID provided");
}

export const client = createThirdwebClient({
    clientId: clientId,
});
