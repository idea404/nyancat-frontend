"use client";

import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { useState, useEffect } from "react";
import { createPublicClient, http, erc20Abi } from "viem";
import { worldchain } from "viem/chains";
import { useSession } from "next-auth/react";
import VaultAbi from "@/abi/USDvyVault.json";

/**
 * USDC token address and Vault contract address.
 * You can set these via NEXT_PUBLIC env vars so they are available at build/runtime.
 */
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ?? "0xUSDC_ADDRESS_HERE") as `0x${string}`;
const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_VAULT_ADDRESS ?? "0xVAULT_ADDRESS_HERE") as `0x${string}`;

export const MintButton = () => {
  const { data: session } = useSession();

  const [buttonState, setButtonState] = useState<
    "pending" | "success" | "failed" | undefined
  >(undefined);

  const [transactionId, setTransactionId] = useState<string>("");

  // Public client for World Chain to poll confirmations
  const client = createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      // MiniKit passes this automatically, but we need it for the hook
      app_id: process.env.WLD_CLIENT_ID as `app_${string}`,
    },
    transactionId,
  });

  // Handle confirmation status updates
  useEffect(() => {
    if (!transactionId || isConfirming) return;

    if (isConfirmed) {
      setButtonState("success");
      // Clear state after a short delay so the user can interact again
      const t = setTimeout(() => setButtonState(undefined), 3000);
      return () => clearTimeout(t);
    }

    if (isError) {
      console.error("Transaction failed", error);
      setButtonState("failed");
      const t = setTimeout(() => setButtonState(undefined), 3000);
      return () => clearTimeout(t);
    }
  }, [isConfirmed, isConfirming, isError, error, transactionId]);

  const handleMint = async () => {
    setButtonState("pending");
    setTransactionId("");

    try {
      const assets = (100 * 10 ** 6).toString(); // 100 USDC with 6 decimals
      const receiver = (session?.user.walletAddress ?? "0x0000000000000000000000000000000000000000") as `0x${string}`;

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          // 1. Approve vault to spend 100 USDC
          {
            address: USDC_ADDRESS,
            abi: erc20Abi,
            functionName: "approve",
            args: [VAULT_ADDRESS, assets],
          },
          // 2. Call deposit on the vault
          {
            address: VAULT_ADDRESS,
            abi: VaultAbi,
            functionName: "deposit",
            args: [assets, receiver],
          },
        ],
      });

      if (finalPayload.status === "success") {
        console.log("Tx submitted, id:", finalPayload.transaction_id);
        setTransactionId(finalPayload.transaction_id);
      } else {
        console.error("sendTransaction failed", finalPayload);
        setButtonState("failed");
        setTimeout(() => setButtonState(undefined), 3000);
      }
    } catch (err) {
      console.error("Error sending transaction", err);
      setButtonState("failed");
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  return (
    <LiveFeedback
      label={{
        failed: "Mint failed",
        pending: "Mint pending",
        success: "Mint successful",
      }}
      state={buttonState}
      className="w-full"
    >
      <Button
        onClick={handleMint}
        disabled={buttonState === "pending"}
        size="lg"
        variant="primary"
        className="w-max mx-auto border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-6 py-2 rounded-lg transition-colors hover:!bg-[var(--highlight)] hover:!border-[var(--highlight)] hover:!text-[var(--background)]"
        style={{ fontFamily: 'var(--font-press-start)' }}
      >
        Mint Now
      </Button>
    </LiveFeedback>
  );
};

export default MintButton; 