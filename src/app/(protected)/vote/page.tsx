"use client";

import { useState } from "react";
import { Page } from "@/components/PageLayout";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { Verify } from "@/components/Verify";

export default function VotePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [forCount, setForCount] = useState(0);
  const [againstCount, setAgainstCount] = useState(0);

  const handleVote = (type: "for" | "against") => {
    if (type === "for") {
      setForCount((c) => c + 1);
    } else {
      setAgainstCount((c) => c + 1);
    }
  };

  return (
    <>
      <Page.Header>
        <h1 className="text-center text-2xl font-bold w-full">Strategy Alpha-III</h1>
      </Page.Header>
      <Page.Main className="flex flex-col items-center gap-6 text-center mb-16">
        <p className="max-w-sm">
          Strategy Alpha-III employs a delta-neutral approach leveraging stablecoin liquidity pools
          at up to 10× leverage, capturing funding rates while hedging price exposure. The strategy
          dynamically rebalances positions to maintain neutrality and auto-compounds yield back into
          the pool.
        </p>

        {!isVerified && <Verify onSuccess={() => setIsVerified(true)} />}

        {isVerified && (
          <>
            <div className="flex gap-4 mt-4">
              <Button size="lg" variant="primary" onClick={() => handleVote("for")}>For ({forCount})</Button>
              <Button size="lg" variant="tertiary" onClick={() => handleVote("against")}>Against ({againstCount})</Button>
            </div>
          </>
        )}
      </Page.Main>
    </>
  );
} 