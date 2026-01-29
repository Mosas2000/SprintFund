export async function sendDiscordAlert(title: string, description: string, url: string, color: number = 0xEA580C) {
    const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK;
    if (!webhookUrl) return;

    const embed = {
        title: `📢 New Proposal: ${title}`,
        description: description.slice(0, 200) + '...',
        url: url,
        color: color,
        fields: [
            { name: 'Status', value: 'Voting Live', inline: true },
            { name: 'Platform', value: 'SprintFund', inline: true },
        ],
        footer: {
            text: 'Powered by Stacks Blockchain',
        },
        timestamp: new Date().toISOString(),
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });
    } catch (error) {
        console.error('Failed to send Discord alert:', error);
    }
}
