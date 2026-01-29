export interface FlashFundingParams {
    proposalId: string;
    vaultBalance: number;
    unanimousConsent: boolean;
    securityScore: number;
}

export function simulateFlashFunding(params: FlashFundingParams) {
    const requirements = {
        minSecurity: 95,
        unanimous: true,
        minBalance: 5000,
    };

    const isEligible =
        params.securityScore >= requirements.minSecurity &&
        params.unanimousConsent === requirements.unanimous &&
        params.vaultBalance >= requirements.minBalance;

    return {
        isEligible,
        timeSaved: '22 hours',
        status: isEligible ? 'FLASH_READY' : 'STANDARD_QUEUE',
        reason: !isEligible ? [
            params.securityScore < requirements.minSecurity ? 'Security score insufficient' : null,
            !params.unanimousConsent ? 'Unanimous consent required for skip' : null,
        ].filter(Boolean) : []
    };
}
