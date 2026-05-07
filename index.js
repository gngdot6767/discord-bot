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
  EmbedBuilder,
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
  const commands = [
    new SlashCommandBuilder()
      .setName("wiadomosc")
      .setDescription("Wyślij wiadomość jako bot (zielona ramka)")
      .addStringOption((opt) =>
        opt
          .setName("tresc")
          .setDescription("Treść wiadomości (możesz oznaczać osoby @nick)")
          .setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName("legit")
      .setDescription("Wystaw opinię 5 gwiazdek dla sprzedawcy")
      .addStringOption((opt) =>
        opt
          .setName("nick")
          .setDescription("Nick osoby, u której kupowałeś")
          .setRequired(true)
      ),
  ];

  const rest = new REST().setToken(token);
  await rest.put(Routes.applicationCommands(applicationId), {
    body: commands.map((c) => c.toJSON()),
  });
  console.log("Zarejestrowano komendy /wiadomosc i /legit");
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log("Bot zalogowany jako:", readyClient.user.tag);
  await registerCommands(readyClient.application.id);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "wiadomosc") {
    const tresc = interaction.options.getString("tresc");

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const channel = await client.channels.fetch(interaction.channelId);

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

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setDescription(tresc);

      await channel.send({ embeds: [embed], allowedMentions: { parse: ["users", "roles", "everyone"] } });
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

  if (interaction.commandName === "legit") {
    const nick = interaction.options.getString("nick");

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const channel = await client.channels.fetch(interaction.channelId);

      if (
        !channel ||
        (channel.type !== ChannelType.GuildText &&
          channel.type !== ChannelType.GuildAnnouncement &&
          channel.type !== ChannelType.PublicThread &&
          channel.type !== ChannelType.PrivateThread)
      ) {
        await interaction.editReply({ content: "Nie mogę wysłać opinii na tym kanale." });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xffd700)
        .setDescription(`⭐⭐⭐⭐⭐\n**${nick}**`);

      await channel.send({ embeds: [embed] });
      await interaction.editReply({ content: "Opinia wysłana!" });
      console.log(`Wystawiono opinię dla ${nick} przez ${interaction.user.tag}`);
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
        await interaction.editReply({ content: "Wystąpił błąd podczas wysyłania opinii." });
      }
    }
  }
});

client.login(token);
