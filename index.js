const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [];
client.once(Events.ClientReady, (readyClient) => {
  console.log("Loading commands...");
  fs.readdirSync("./commands", { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .forEach((e) =>
      fs
        .readdirSync(path.join(e.parentPath, e.name), { withFileTypes: true })
        .forEach((f) => {
          const command = require(path.join(f.parentPath, f.name));
          readyClient.application.commands.create(command.data);
          commands.push({ name: command.data.name, execute: command.execute });
        })
    );
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.addListener(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  commands.filter((e) => e.name === interaction.commandName)[0](interaction);
});
process.chdir(__dirname);
client.login(process.env.TOKEN);
