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
        <h1 className="text-4xl md:text-5xl leading-tight">NYAnCaT</h1>
        <h3 className="max-w-xs text-sm md:text-base font-light text-muted-foreground">
          Neutral Yield AggregatioNal Compounding Algorithmic Treasury
        </h3>
        <p className="max-w-xs text-sm md:text-base">
          Earn yield from advanced AI delta-neutral strategies throughout crypto
        </p>
        <div className="text-5xl md:text-6xl font-bold">14.7%</div>
        <p className="text-sm uppercase tracking-wide">Backtested APY</p>
        <button className="mt-4 border-2 border-[var(--foreground)] text-[var(--foreground)] px-6 py-2 rounded-lg transition-colors hover:bg-[var(--highlight)] hover:text-[var(--background)]">
          Mint
        </button>
        <button className="underline mt-2 text-sm">Learn More</button>
      </Page.Main>
    </>
  );
}
