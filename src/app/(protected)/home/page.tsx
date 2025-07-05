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
          title="Home"
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
        <h1 className="text-6xl md:text-7xl font-bold leading-none">vyVault</h1>
        <p className="max-w-xs text-lg md:text-xl">
          Earn yield from advanced AI delta-neutral strategies throughout crypto
        </p>
        <div className="text-5xl md:text-6xl font-bold">14.7%</div>
        <p className="text-sm uppercase tracking-wide">Backtested APY</p>
        <button className="mt-4 border-2 border-black px-8 py-2 rounded-lg transition-colors hover:bg-[color:var(--highlight)]">
          Mint
        </button>
        <button className="underline mt-2 text-sm">Learn More</button>
      </Page.Main>
    </>
  );
}
