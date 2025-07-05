'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { useState } from 'react';

/**
 * This component is an example of how to use World ID in Mini Apps
 * Minikit commands must be used on client components
 * It's critical you verify the proof on the server side
 * Read More: https://docs.world.org/mini-apps/commands/verify#verifying-the-proof
 */
export const Verify = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);

  const [whichVerification, setWhichVerification] = useState<VerificationLevel>(
    VerificationLevel.Device,
  );

  const onClickVerify = async (verificationLevel: VerificationLevel) => {
    setButtonState('pending');
    setWhichVerification(verificationLevel);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await MiniKit.commandsAsync.verify({ // types are outdated
      action: 'verify',
      verification_level: verificationLevel,
    });
    console.log(result.finalPayload);
    // Verify the proof
    const appId = process.env.NEXT_PUBLIC_APP_ID;
    console.log('NEXT_PUBLIC_APP_ID:', appId);
    const verifyUrl = `https://developer.worldcoin.org/api/v2/verify/${appId}`;
    console.log('Verifying with URL:', verifyUrl);

    const requestBody = {
      nullifier_hash: result.finalPayload.nullifier_hash,
      merkle_root: result.finalPayload.merkle_root,
      proof: result.finalPayload.proof,
      verification_level: result.finalPayload.verification_level,
      action: 'verify',
    };

    console.log('Request Body before stringify:', requestBody);

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (data.verifyRes.success) {
      setButtonState('success');
      console.log("yay it worked");
      // Here we'll just do nothing
    } else {
      setButtonState('failed');
      console.log("merp I failed", result.finalPayload)

      // Reset the button state after 3 seconds
      setTimeout(() => {
        setButtonState(undefined);
      }, 2000);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Verify</p>
      <LiveFeedback
        label={{
          failed: 'Failed to verify',
          pending: 'Verifying',
          success: 'Verified',
        }}
        state={
          whichVerification === VerificationLevel.Device
            ? buttonState
            : undefined
        }
        className="w-full"
      >
        <Button
          onClick={() => onClickVerify(VerificationLevel.Device)}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="tertiary"
          className="w-full"
        >
          Verify (Device)
        </Button>
      </LiveFeedback>
      <LiveFeedback
        label={{
          failed: 'Failed to verify',
          pending: 'Verifying',
          success: 'Verified',
        }}
        state={
          whichVerification === VerificationLevel.Orb ? buttonState : undefined
        }
        className="w-full"
      >
        <Button
          onClick={() => onClickVerify(VerificationLevel.Orb)}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Verify (Orb)
        </Button>
      </LiveFeedback>
    </div>
  );
};
