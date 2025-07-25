"use client";

import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit, ResponseEvent, Network } from "@worldcoin/minikit-js";
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
const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ?? "0x66145f38cBAC35Ca6F1Dfb4914dF98F1614aeA88") as `0x${string}`;
const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_VAULT_ADDRESS ?? "0x160521A3f3Caec20c0eF62bFFB846892f5769ae6") as `0x${string}`;
// Flag that allows us to short-circuit on-chain confirmations (demo/stub mode)
const DEMO_MODE = true;

interface MintButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export const MintButton = ({ onSuccess, className }: MintButtonProps) => {
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

      if (DEMO_MODE) {
        // ---------------------------------------------
        // DEMO FLOW: use signMessage so the user still signs something,
        // then emit a synthetic MiniAppSendTransaction success event so
        // downstream hooks behave as if a tx was submitted.
        // ---------------------------------------------
        const msg = `Demo deposit of 100 USDC to vault ${VAULT_ADDRESS}`;
        const { finalPayload } = await MiniKit.commandsAsync.signMessage({ message: msg });

        if (finalPayload.status === "success") {
          // Craft a fake transaction id (64-byte hex)
          const txId = `0x${crypto.randomUUID().replace(/-/g, "").padEnd(64, "0")}` as `0x${string}`;

          // Notify listeners (e.g., useWaitForTransactionReceipt) manually
          MiniKit.trigger(ResponseEvent.MiniAppSendTransaction, {
            status: "success",
            transaction_status: "submitted",
            transaction_id: txId,
            reference: "demo-ref",
            from: receiver,
            chain: Network.WorldChain,
            timestamp: new Date().toISOString(),
            version: 1,
          });

          // Update UI – skip polling in demo mode
          setButtonState("success");
          onSuccess?.();
          setTimeout(() => setButtonState(undefined), 3000);
        } else {
          console.error("[DEMO] signMessage failed", finalPayload);
          setButtonState("failed");
          setTimeout(() => setButtonState(undefined), 3000);
        }
      } else {
        // ---------------------------------------------
        // PRODUCTION FLOW: real on-chain transaction
        // ---------------------------------------------
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
        failed: "Deposit failed",
        pending: "Deposit pending",
        success: "Deposit successful",
      }}
      state={buttonState}
      className="w-full"
    >
      <Button
        onClick={handleMint}
        disabled={buttonState === "pending"}
        size="lg"
        variant="primary"
        className={`w-full border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-6 py-2 rounded-lg transition-colors hover:!bg-[var(--highlight)] hover:!border-[var(--highlight)] hover:!text-[var(--background)] ${className ?? ""}`}
        style={{ fontFamily: 'var(--font-press-start)' }}
      >
        Deposit Now
      </Button>
    </LiveFeedback>
  );
};

export default MintButton; 