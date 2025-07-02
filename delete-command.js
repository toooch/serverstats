const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');
const { token } = require('./token.json');
const commandId = '1389996679582846976';

const rest = new REST().setToken(token);

rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId))
    .then(() => console.log(`Successfully deleted command with ID: ${commandId}`))
    .catch(console.error);