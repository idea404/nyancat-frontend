"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Page } from "@/components/PageLayout";
import { Marble, TopBar, Button } from "@worldcoin/mini-apps-ui-kit-react";
import RainbowText from "@/components/RainbowText";
import DepositButton from "@/components/DepositButton";
import MintButton from "@/components/MintButton";
import { Player } from "@lottiefiles/react-lottie-player";

export default function Home() {
    const { data: session } = useSession();
    const [balance, setBalance] = useState<number>(0);
    const [shares, setShares] = useState<number>(0);

    // Determine if the user has deposited yet
    const isZeroBalance = balance === 0;

    const incrementBalance = () => {
        setBalance((prev) => prev + 100);
        setShares((prev) => prev + 100);
    };

    useEffect(() => {
        if (shares === 0) return;

        const interval = setInterval(() => {
            setBalance((prev) => Number((prev * 1.0001).toFixed(2)));
        }, 2000);

        return () => clearInterval(interval);
    }, [shares]);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <>
            {/* Single Header with conditional content */}
            <Page.Header className="p-0 relative">
                {isZeroBalance ? (
                    <Player
                    className="absolute left-5 top-8"
                      src="/nyan.json"   // lives in /public, so this path is fine
                      autoplay
                      loop
                      style={{ width: 80, height: 80 }}  // tailwind classes also OK
                    />
                ) : (
                    <div className="absolute left-5 top-8">
                        <RainbowText text="NYAnCAT" />
                    </div>
                )}

                <TopBar
                    title=""
                    endAdornment={
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold capitalize">{session?.user.username}</p>
                            <Marble src={session?.user.profilePictureUrl} className="w-12" />
                        </div>
                    }
                />
            </Page.Header>

            {/* Decide which screen to render */}
            {isZeroBalance ? (
                /* First-time hero */
                <Page.Main className="flex flex-col items-center justify-center gap-6 text-center mb-16">
                    <div className="flex flex-col items-center gap-0">
                        <h1 className="text-4xl md:text-5xl leading-tight mb-0">
                            <RainbowText text="NYAnCAT" />
                        </h1>
                        <p className="max-w-xs text-[10px] md:text-xs font-light text-muted-foreground -mt-1">
                            Neutral Yield AggregatioNal Compounding Algorithmic Treasury
                        </p>
                    </div>
                    <p className="max-w-xs text-sm md:text-base">Earn yield from advanced AI delta-neutral strategies throughout crypto</p>
                    <div className="text-5xl md:text-6xl font-bold mb-0">
                        <RainbowText text="14.7%" />
                    </div>
                    <p className="text-sm tracking-wide mt-0">Backtested APY</p>
                    <div className="w-full max-w-xs flex flex-col items-center gap-2">
                        <MintButton onSuccess={incrementBalance} />
                        <button className="underline text-sm">Learn More</button>
                    </div>
                </Page.Main>
            ) : (
                /* Balance screen */
                <Page.Main className="flex flex-col items-center justify-center text-center mb-16 gap-4">
                    {/* Cat image where hero text was */}
                    <Player
                      src="/nyan.json"   // lives in /public, so this path is fine
                      autoplay
                      loop
                      style={{ width: 200, height: 200 }}  // tailwind classes also OK
                    />

                    <h3 className="text-sm -mt-1 -mb-1">Your Balance</h3>
                    <div className="text-5xl md:text-6xl font-bold leading-tight -mt-1 -mb-1">{formatter.format(balance)}</div>
                    <p className="text-xs -mt-1 mb-2 opacity-80">{shares.toLocaleString()} vyShares</p>

                    <div className="text-4xl font-bold leading-tight mt-2 -mb-1">42.69%</div>
                    <p className="text-xs -mt-1">YTD Return</p>

                    {/* Buttons */}
                    <div className="flex gap-2 w-full max-w-xs mt-4 justify-center">
                        <DepositButton onSuccess={incrementBalance} />
                        <div className="flex-1">
                            <Button
                                size="lg"
                                variant="tertiary"
                                disabled
                                className="w-full border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-6 py-2 rounded-lg"
                                style={{ fontFamily: "var(--font-press-start)" }}
                            >
                                Redeem
                            </Button>
                        </div>
                    </div>
                </Page.Main>
            )}
        </>
    );
}
