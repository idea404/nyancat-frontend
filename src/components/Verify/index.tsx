'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { useState, type FC } from 'react';

/**
 * This component is an example of how to use World ID in Mini Apps
 * Minikit commands must be used on client components
 * It's critical you verify the proof on the server side
 * Read More: https://docs.world.org/mini-apps/commands/verify#verifying-the-proof
 */

interface VerifyProps {
  onSuccess?: () => void;
}

export const Verify: FC<VerifyProps> = ({ onSuccess }) => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);

  // no need to track which verification variant when only Device is available
  // const whichVerification = VerificationLevel.Device;

  const onClickVerify = async () => {
    if (buttonState === 'pending') return;
    setButtonState('pending');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await MiniKit.commandsAsync.verify({ // types are outdated
      action: 'verify',
      verification_level: VerificationLevel.Device,
    });
    console.log(result.finalPayload);

    if (result.finalPayload.status === 'success') {
      // Store verification details in a cookie for 7 days
      document.cookie = `worldcoinVerification=${encodeURIComponent(
        JSON.stringify(result.finalPayload),
      )}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;

      setButtonState('success');
      console.log('Verification saved in cookie');
      onSuccess?.();
    } else {
      setButtonState('failed');
      console.log('Verification failed', result.finalPayload);

      // Reset the button state after 3 seconds
      setTimeout(() => {
        setButtonState(undefined);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <LiveFeedback
        label={{
          failed: 'Failed to verify',
          pending: 'Verifying',
          success: 'Verified',
        }}
        state={buttonState}
        className="w-full flex justify-center"
      >
        <Button
          onClick={onClickVerify}
          disabled={buttonState === 'pending'}
          size="sm"
          variant="primary"
          className="w-[120px] border-2 !bg-[var(--background)] !border-[var(--foreground)] !text-[var(--foreground)] font-[var(--font-press-start)] px-4 py-2 rounded-lg transition-colors hover:!bg-[var(--highlight)] hover:!border-[var(--highlight)] hover:!text-[var(--background)]"
          style={{ fontFamily: 'var(--font-press-start)' }}
        >
          Verify
        </Button>
      </LiveFeedback>
    </div>
  );
};
