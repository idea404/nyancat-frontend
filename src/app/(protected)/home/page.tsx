"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Page } from "@/components/PageLayout";
import { Marble, TopBar, Button } from "@worldcoin/mini-apps-ui-kit-react";
import RainbowText from "@/components/RainbowText";
import DepositButton from "@/components/DepositButton";

export default function Home() {
    const { data: session } = useSession();
    const [balance, setBalance] = useState<number>(0);

    const incrementBalance = () => setBalance((prev) => prev + 100);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <>
            {balance === 0 && (
                <Page.Header className="p-0">
                    <img
                        src="https://www.pngplay.com/wp-content/uploads/7/Nyan-Cat-Pixel-Art-Transparent-Free-PNG.png"
                        alt="nyan cat"
                        className="absolute left-3 top-3 w-20 h-auto"
                    />
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
            )}

            {balance !== 0 && (
                <Page.Header className="p-0 relative">
                    {/* Rainbow title top-left */}
                    <div className="absolute left-5 top-10">
                        <RainbowText text="NYAnCAT" />
                    </div>
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
            )}

            {/* Decide which screen to render */}
            {balance === 0 ? (
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

                    <h2 className="text-base tracking-wide mt-4">Your Balance</h2>
                    <div className="text-5xl md:text-6xl font-bold">{formatter.format(balance)}</div>
                    <p className="text-sm opacity-80">{balance.toLocaleString()} vyShares</p>

                    <div className="text-4xl font-bold mb-0">42.69%</div>
                    <p className="text-sm tracking-wide mt-0">YTD Return</p>

                    <div className="flex gap-4 mt-4">
                        <DepositButton onSuccess={incrementBalance} />
                        <Button
                            size="lg"
                            variant="tertiary"
                            disabled
                            className="w-max mx-auto border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-6 py-2 rounded-lg"
                            style={{ fontFamily: "var(--font-press-start)" }}
                        >
                            Redeem
                        </Button>
                    </div>
                </Page.Main>
            ) : (
                /* Balance screen */
                <Page.Main className="flex flex-col items-center justify-center text-center mb-16 gap-4">
                    {/* Cat image where hero text was */}
                    <img
                        src="https://www.pngplay.com/wp-content/uploads/7/Nyan-Cat-Pixel-Art-Transparent-Free-PNG.png"
                        alt="nyan cat"
                        className="w-32 h-auto"
                    />

                    <h3 className="text-sm mt-2">Your Balance</h3>
                    <div className="text-5xl md:text-6xl font-bold leading-tight">{formatter.format(balance)}</div>
                    <p className="text-xs -mt-1 mb-2 opacity-80">{balance.toLocaleString()} vyShares</p>

                    <div className="text-4xl font-bold leading-tight mt-2">42.69%</div>
                    <p className="text-xs -mt-1">YTD Return</p>

                    {/* Buttons */}
                    <div className="flex gap-2 w-full max-w-xs mt-4">
                        <DepositButton onSuccess={incrementBalance} />
                        <Button
                            size="lg"
                            variant="tertiary"
                            disabled
                            className="flex-1 border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-6 py-2 rounded-lg"
                            style={{ fontFamily: "var(--font-press-start)" }}
                        >
                            Redeem
                        </Button>
                    </div>
                </Page.Main>
            )}
        </>
    );
}
