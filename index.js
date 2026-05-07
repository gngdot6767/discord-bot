const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  Events,
  MessageFlags,
  ChannelType,
} = require("discord.js");

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error("Brak DISCORD_BOT_TOKEN!");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

async function registerCommands(applicationId) {
  const command = new SlashCommandBuilder()
    .setName("2wiadomosc")
    .setDescription("Wyślij wiadomość jako bot");

  const rest = new REST().setToken(token);
  await rest.put(Routes.applicationCommands(applicationId), {
    body: [command.toJSON()],
  });
  console.log("Zarejestrowano komendę /2wiadomosc");
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log("Bot zalogowany jako:", readyClient.user.tag);
  await registerCommands(readyClient.application.id);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === "2wiadomosc") {
    const modal = new ModalBuilder()
      .setCustomId(`wiadomosc_modal:${interaction.channelId}`)
      .setTitle("Wyślij wiadomość jako bot");

    const textInput = new TextInputBuilder()
      .setCustomId("tresc_wiadomosci")
      .setLabel("Treść wiadomości")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Napisz tutaj swoją wiadomość...")
      .setRequired(true)
      .setMaxLength(2000);

    const row = new ActionRowBuilder().addComponents(textInput);
    modal.addComponents(row);
    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith("wiadomosc_modal:")) {
    const tresc = interaction.fields.getTextInputValue("tresc_wiadomosci");
    const channelId = interaction.customId.split(":")[1];

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const channel = await client.channels.fetch(channelId);

      if (
        !channel ||
        (channel.type !== ChannelType.GuildText &&
          channel.type !== ChannelType.GuildAnnouncement &&
          channel.type !== ChannelType.PublicThread &&
          channel.type !== ChannelType.PrivateThread)
      ) {
        await interaction.editReply({ content: "Nie mogę wysłać wiadomości na tym kanale." });
        return;
      }

      await channel.send(tresc);
      await interaction.editReply({ content: "Wiadomość wysłana!" });
      console.log(`Wysłano wiadomość przez ${interaction.user.tag}`);
    } catch (err) {
      console.error("Błąd:", err.message);
      if (err.code === 50001 || err.code === 50013) {
        await interaction.editReply({
          content:
            "Bot nie ma uprawnień na tym kanale.\n" +
            "Wejdź w Ustawienia kanału → Uprawnienia i dodaj botowi:\n" +
            "✅ Wyświetlaj kanał\n" +
            "✅ Wysyłaj wiadomości",
        });
      } else {
        await interaction.editReply({ content: "Wystąpił błąd podczas wysyłania wiadomości." });
      }
    }
  }
});

client.login(token);
