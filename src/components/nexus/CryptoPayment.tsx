'use client';

import { client } from "@/lib/thirdweb";
import { PayEmbed, useActiveAccount } from "thirdweb/react";

export default function CryptoPayment() {
    const account = useActiveAccount();

    return (
        <div className="w-full flex flex-col items-center">
            <div className={`transition-all duration-500 ${account ? 'w-full' : 'w-auto'}`}>
                {/* 
                  Using PayEmbed directly allows for the "Checkout Widget" experience requested.
                  Customization is applied via the `theme` prop to match Utility Red.
                */}
                <PayEmbed
                    client={client}
                    theme={"dark"}
                    payOptions={{
                        prefillBuy: {
                            chain: {
                                id: 1, // Mainnet (or Base/Polygon as configured)
                                rpc: "https://eth.llamarpc.com",
                                name: "Ethereum"
                            },
                            allowEdits: {
                                amount: true,
                                token: true,
                                chain: true
                            }
                        }
                    }}
                    connectOptions={{
                        connectModal: {
                            size: "compact",
                            title: "TUC Nexus",
                            welcomeScreen: {
                                title: "Secure Crypto Gateway",
                                subtitle: "Connect to invest via The Utility Network"
                            }
                        }
                    }}
                />
            </div>

            {!account && (
                <p className="mt-4 text-xs text-white/40 uppercase tracking-widest text-center">
                    Securely connect your wallet to proceed
                </p>
            )}
        </div>
    );
}
