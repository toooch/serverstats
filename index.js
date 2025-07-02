const { Client, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./token.json');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Client ready: ${readyClient.user.tag} (${readyClient.user.id})`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'mcstatus':
            let ip = interaction.options.getString('ip');
            if (!ip) {
                ip = '144.91.118.22';
            }

            // Use flags instead of ephemeral
            await interaction.reply({ content: `Fetching status for Minecraft server at ${ip}...`, flags: 64 });

            // Await response.json()
            const response = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            let title = typeof data.hostname === 'string' && data.hostname.length > 0
                ? data.hostname
                : (typeof data.ip === 'string' && data.ip.length > 0 ? data.ip : 'Unknown Server');

            if (!data.online) title += ' (Offline)';

            let embed = new EmbedBuilder()
                .setColor(data.online ? 0x00FF00 : 0xFF0000)
                .setTitle(title)
                .setImage(`https://api.mcsrvstat.us/icon/${ip}`)
                .setTimestamp();

            if (data.online) {
                embed
                    .setURL(`https://mcsrvstat.us/server/${ip}`)
                    .setDescription(data.motd?.clean?.join('\n') || '')
                    .addFields(
                        {
                            name: 'Version',
                            value: data.version || 'Unknown',
                            inline: true
                        },
                        {
                            name: `Players: ${data.players?.online ?? 0}/${data.players?.max ?? 0}`,
                            value: data.players?.list ? data.players.list.map(item => item.name).join('\n') : '',
                            inline: false
                        }
                    );

                if (data.mods) {
                    embed.addFields({
                        name: 'Mods: ' + data.mods.length,
                        value: '',
                        inline: true
                    });
                }
            }


            let channel = client.channels.cache.get(interaction.channelId);
            await channel.send({embeds: [embed]});
            await interaction.deleteReply();

    }
});

client.login(token);