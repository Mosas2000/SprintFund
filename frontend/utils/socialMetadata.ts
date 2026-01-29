export interface ProposalMetadata {
    title: string;
    category: string;
    amount: string;
    author: string;
}

export function generateSocialMetadata(proposal: ProposalMetadata) {
    const baseUrl = 'https://sprintfund.xyz';
    const encodedTitle = encodeURIComponent(proposal.title);
    const encodedCat = encodeURIComponent(proposal.category);
    const encodedAmt = encodeURIComponent(proposal.amount);

    // Using a dynamic OG image service (like Vercel OG or Cloudinary)
    // For now, we'll return a structured metadata object
    return {
        title: `${proposal.title} | SprintFund Micro-Grant`,
        description: `A ${proposal.amount} STX grant proposal in ${proposal.category} by ${proposal.author}. Help fund this idea on SprintFund!`,
        ogImage: `https://og-image.sprintfund.xyz/api/proposal?title=${encodedTitle}&category=${encodedCat}&amount=${encodedAmt}`,
        twitterCard: 'summary_large_image',
    };
}
