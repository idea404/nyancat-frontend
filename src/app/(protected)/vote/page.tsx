"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Page } from "@/components/PageLayout";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { Verify } from "@/components/Verify";

export default function VotePage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [forCount, setForCount] = useState(0);
  const [againstCount, setAgainstCount] = useState(0);
  const [totalVotes, setTotalVotes] = useState(() => 1000 + Math.floor(Math.random() * 500));
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (type: "for" | "against") => {
    if (hasVoted) return; // prevent multiple votes

    if (type === "for") {
      setForCount((c) => c + 1);
    } else {
      setAgainstCount((c) => c + 1);
    }

    setTotalVotes((t) => t + 1);
    setHasVoted(true);
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
            <p className="text-sm mt-2">Total votes cast: {totalVotes.toLocaleString()}</p>

            <div className="flex gap-4 mt-2">
              <Button
                size="sm"
                variant="primary"
                disabled={hasVoted}
                onClick={() => handleVote("for")}
                className="w-[120px] border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-4 py-2 rounded-lg transition-colors hover:!bg-[var(--highlight)] hover:!border-[var(--highlight)] hover:!text-[var(--background)]"
                style={{ fontFamily: 'var(--font-press-start)' }}
              >
                For ({forCount})
              </Button>
              <Button
                size="sm"
                variant="tertiary"
                disabled={hasVoted}
                onClick={() => handleVote("against")}
                className="w-[120px] border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-4 py-2 rounded-lg transition-colors hover:!bg-[var(--highlight)] hover:!border-[var(--highlight)] hover:!text-[var(--background)]"
                style={{ fontFamily: 'var(--font-press-start)' }}
              >
                Against ({againstCount})
              </Button>
            </div>

            <Button
              size="sm"
              variant="tertiary"
              className="w-[120px] border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-4 py-2 rounded-lg mt-4 transition-colors hover:!bg-[var(--highlight)] hover:!border-[var(--highlight)] hover:!text-[var(--background)]"
              style={{ fontFamily: 'var(--font-press-start)' }}
              onClick={() => router.push('/home')}
            >
              Go Back
            </Button>
          </>
        )}
      </Page.Main>
    </>
  );
} 