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
          src="https://www.pngplay.com/wp-content/uploads/7/Nyan-Cat-Pixel-Art-Transparent-Free-PNG.png"
          alt="nyan cat"
          className="absolute left-3 top-3 w-30 h-auto"
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
        <div className="flex flex-col items-center gap-0">
          <h1 className="text-4xl md:text-5xl leading-tight mb-0">NYAnCAT</h1>
          <p className="max-w-xs text-[10px] md:text-xs font-light text-muted-foreground -mt-1">
            Neutral Yield AggregatioNal Compounding Algorithmic Treasury
          </p>
        </div>
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
