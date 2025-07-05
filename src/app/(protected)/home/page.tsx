import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
// import { Pay } from '@/components/Pay';
// import { Transaction } from '@/components/Transaction';
// import { UserInfo } from '@/components/UserInfo';
// import { Verify } from '@/components/Verify';
// import { ViewPermissions } from '@/components/ViewPermissions';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Page.Header className="p-0">
        <img
          src="data:image/png;base64,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"
          alt="nyan cat"
          className="absolute left-3 top-3 w-10 h-auto"
        />
        <TopBar
          title=""
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">
                {session?.user.username}
              </p>
              <Marble src={session?.user.profilePictureUrl} className="w-12" />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-center gap-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl leading-tight mb-0">NYAnCAT</h1>
        <p className="max-w-xs text-xs md:text-base font-light text-muted-foreground mt-0">
          Neutral Yield AggregatioNal Compounding Algorithmic Treasury
        </p>
        <p className="max-w-xs text-sm md:text-base">
          Earn yield from advanced AI delta-neutral strategies throughout crypto
        </p>
        <div className="text-5xl md:text-6xl font-bold mb-0">14.7%</div>
        <p className="text-sm tracking-wide mt-0">Backtested APY</p>
        <button className="mt-4 border-2 border-[var(--foreground)] text-[var(--foreground)] px-6 py-2 rounded-lg transition-colors hover:bg-[var(--highlight)] hover:border-[var(--highlight)] hover:text-[var(--background)]">
          Mint Now
        </button>
        <button className="underline mt-2 text-sm">Learn More</button>
      </Page.Main>
    </>
  );
}
