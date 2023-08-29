const { Client, IntentsBitField, REST, Routes  } = require('discord.js');

require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const commands = [
    {
        name: 'minutes-next',
        description: 'Get the next person responsible for writing the meeting minutes.',
    },
    {
        name: 'minutes-done',
        description: 'Mark that the current person has finished writing the minutes.',
    },
    {
        name: 'agenda-next',
        description: 'Get the next person responsible for writing the agenda.',
    },
    {
        name: 'agenda-done',
        description: 'Mark that the current person has finished writing the agenda.',
    },
    {
        name: 'minutes-peek',
        description: 'Check who is on minutes after the current person.',
    },
    {
        name: 'agenda-peek',
        description: 'Check who is on the agenda after the current person.',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async() => {
    try {
        console.log("Registering slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log("Slash commands were registered successfully.");

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();

const minutes_roster = ["Jack", "Rachel", "Rob", "Jade", "Moni"];
const agenda_roster = ["Jade", "Moni", "Jack", "Rachel", "Rob"];

let currentMinuteTakerIndex = 0;
let currentAgendaTakerIndex = 0;

client.on('ready', (c) => {
    console.log(`${c.user.username} is online.`);
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === "minutes-next") {
        const currentMinuteTaker = minutes_roster[currentMinuteTakerIndex];
        await interaction.reply(`It's ${currentMinuteTaker}'s turn to write the minutes.`);
    }

    if(interaction.commandName === "minutes-done") {
        currentMinuteTakerIndex = (currentMinuteTakerIndex + 1) % minutes_roster.length;
        const currentMinuteTaker = minutes_roster[currentMinuteTakerIndex];
        
        await interaction.reply(`It's now ${currentMinuteTaker}'s turn write the minutes.`);
    }

    if(interaction.commandName === "agenda-next") {
        const currentAgendaTaker = agenda_roster[currentAgendaTakerIndex];
        await interaction.reply(`It's ${currentAgendaTaker}'s turn to write the agenda.`);
    }

    if(interaction.commandName === "agenda-done") {
        currentAgendaTakerIndex = (currentAgendaTakerIndex + 1) % agenda_roster.length;
        const currentAgendaTaker = agenda_roster[currentAgendaTakerIndex];
        
        await interaction.reply(`It's now ${currentAgendaTaker}'s turn write the agenda.`);
    }

    if(interaction.commandName === "agenda-peek") {
        const currentAgendaTaker = agenda_roster[currentAgendaTakerIndex];
        const nextAgendaTaker = agenda_roster[(currentAgendaTakerIndex + 1) % agenda_roster.length];
        await interaction.reply(`${nextAgendaTaker} is on the agenda after ${currentAgendaTaker}`);
    }

    if(interaction.commandName === "minutes-peek") {
        const currentMinutesTaker = minutes_roster[currentMinutesTakerIndex];
        const nextMinutesTaker = minutes_roster[(currentMinutesTakerIndex + 1) % minutes_roster.length];
        await interaction.reply(`${nextMinutesTaker} is on the minutes after ${currentMinutesTaker}`);
    }
});

client.login(process.env.TOKEN);
