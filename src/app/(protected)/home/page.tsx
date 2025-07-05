"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Page } from "@/components/PageLayout";
import { Marble, TopBar, Button } from "@worldcoin/mini-apps-ui-kit-react";
import RainbowText from "@/components/RainbowText";
import DepositButton from "@/components/DepositButton";
import MintButton from "@/components/MintButton";
import { Player } from "@lottiefiles/react-lottie-player";

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();
    const [balance, setBalance] = useState<number>(0);
    const [shares, setShares] = useState<number>(0);

    // Determine if the user has deposited yet
    const isZeroBalance = balance === 0;

    // Hard-coded degen news messages the cat can say
    const degenNews = [
        "$PEPE has been all over X today, 6 whales bought in and trading is starting to slow... It would be a shame if the price would start tanking soon...",
        "Rumour has it $DOGE options expiring tomorrow could send it to the moon – or the crater. Choose wisely, anon.",
        "$SOL racked up 300k failed TPS again. Maybe it's time for a break-even exit?",
        "Three wallets just swept the entire CrypToadz floor. Frogs incoming?",
        "Funding flipped negative on $ETH perp. Bears getting greedy…" 
    ];

    // Chat bubble state
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState<string>("");

    /**
     * Toggle the degen-news chat bubble. When opening, pick a random message.
     * Tapping the cat again will close the bubble.
     */
    const toggleChat = () => {
        if (showChat) {
            setShowChat(false);
            return;
        }

        // Pick a random message each time the cat is tapped **and** the bubble is being opened
        const random = degenNews[Math.floor(Math.random() * degenNews.length)];
        setChatMessage(random);
        setShowChat(true);
    };

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
                    className="absolute left-5 top-1"
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

                    {/* Vote button */}
                    <Button
                        size="sm"
                        variant="primary"
                        className="mt-2"
                        onClick={() => router.push('/vote')}
                    >
                        Vote
                    </Button>

                    <h3 className="text-sm -mt-1 -mb-1">Your Balance</h3>
                    <div className="text-5xl md:text-6xl font-bold leading-tight -mt-1 -mb-1">{formatter.format(balance)}</div>
                    <p className="text-xs -mt-1 mb-2 opacity-80">{shares.toLocaleString()} vyShares</p>

                    <div className="text-4xl font-bold leading-tight mt-2 -mb-1">42.69%</div>
                    <p className="text-xs -mt-1">YTD Return</p>

                    {/* Buttons */}
                    <div className="flex gap-2 w-full max-w-xs mt-4 justify-center">
                        <DepositButton onSuccess={incrementBalance} />

                        {/* Degen-news cat button – wrapper now has fixed width to balance layout */}
                        <div className="relative w-[120px] flex justify-center">
                            <button
                                onClick={toggleChat}
                                className="rounded-full border-2 border-[var(--foreground)] p-1 bg-[var(--background)] flex items-center justify-center"
                                style={{ width: 56, height: 56 }}
                            >
                                <Player src="/menu.json" autoplay loop style={{ width: 48, height: 48 }} />
                            </button>

                            {/* Pixel-style chat bubble – now anchored to the cat button instead of the viewport centre */}
                            {showChat && (
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 z-50 bg-[var(--foreground)] border-4 border-[gray] p-4 pointer-events-auto w-max max-w-[250px] whitespace-normal"
                                    style={{ bottom: "calc(100% + 10px)", fontFamily: "var(--font-press-start)" }}
                                >
                                    <p
                                        className="text-xs leading-relaxed text-[var(--background)]"
                                        style={{ wordBreak: "break-word" }}
                                    >
                                        {chatMessage}
                                    </p>

                                    {/* Bubble tail – centered under the bubble */}
                                    <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--foreground)] border-l-4 border-b-4 border-[gray] rotate-45" />
                                </div>
                            )}
                        </div>

                        <div>
                            <Button
                                size="sm"
                                variant="tertiary"
                                disabled
                                className="w-[120px] border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-4 py-2 rounded-lg"
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
