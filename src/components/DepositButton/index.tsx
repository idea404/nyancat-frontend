"use client";

import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit, ResponseEvent, Network } from "@worldcoin/minikit-js";
import { useState } from "react";
import { useSession } from "next-auth/react";

const DEMO_MODE = true;
const USDC_AMOUNT = 100;
const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_VAULT_ADDRESS ?? "0xVAULT_ADDRESS_HERE") as `0x${string}`;

interface DepositButtonProps {
  onSuccess?: () => void;
}

export const DepositButton = ({ onSuccess }: DepositButtonProps) => {
  const { data: session } = useSession();
  const [buttonState, setButtonState] = useState<
    "pending" | "success" | "failed" | undefined
  >(undefined);

  const handleDeposit = async () => {
    if (buttonState === "pending") return;
    setButtonState("pending");

    try {
      const receiver = (session?.user.walletAddress ??
        "0x0000000000000000000000000000000000000000") as `0x${string}`;

      if (DEMO_MODE) {
        const message = `Demo deposit of ${USDC_AMOUNT} USDC to vault ${VAULT_ADDRESS}`;
        const { finalPayload } = await MiniKit.commandsAsync.signMessage({
          message,
        });

        if (finalPayload.status === "success") {
          // Fire synthetic event so other hooks (if any) can listen
          MiniKit.trigger(ResponseEvent.MiniAppSendTransaction, {
            status: "success",
            transaction_status: "submitted",
            transaction_id: `0x${crypto
              .randomUUID()
              .replace(/-/g, "")
              .padEnd(64, "0")}`,
            reference: "demo-deposit",
            from: receiver,
            chain: Network.WorldChain,
            timestamp: new Date().toISOString(),
            version: 1,
          });

          setButtonState("success");
          onSuccess?.();
          setTimeout(() => setButtonState(undefined), 3000);
        } else {
          console.error("[DEMO] signMessage failed", finalPayload);
          setButtonState("failed");
          setTimeout(() => setButtonState(undefined), 3000);
        }
      } else {
        // Production – you would place real sendTransaction logic here.
        setButtonState("failed");
        setTimeout(() => setButtonState(undefined), 3000);
      }
    } catch (err) {
      console.error("Deposit error", err);
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
      className=""
    >
      <Button
        onClick={handleDeposit}
        disabled={buttonState === "pending"}
        size="sm"
        variant="primary"
        className="w-[108px] border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-0 py-2 rounded-lg transition-colors hover:!bg-[var(--highlight)] hover:!border-[var(--highlight)] hover:!text-[var(--background)]"
        style={{ fontFamily: "var(--font-press-start)" }}
      >
        Deposit
      </Button>
    </LiveFeedback>
  );
};

export default DepositButton; 