const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { clientId, guildId } = require('./config.json');
const { token } = require('./token.json');

const commands = [
    new SlashCommandBuilder()
        .setName('mcstatus')
        .setDescription('Get the status of a Minecraft server')
        .addStringOption(option =>
            option
                .setName('ip')
                .setDescription('The IP address of the server')),

];

const jsonCommands = commands.map(c => c.toJSON())

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${jsonCommands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: jsonCommands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();