const { Client, GatewayIntentBits, Events } = require('discord.js')
require('dotenv').config()

const SOURCE_GUILD_ID = 'SOURCE_SERVER_ID'
const TARGET_GUILD_ID = 'TARGET_SERVER_ID'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans
  ]
})

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on(Events.GuildBanAdd, async (ban) => {
  const { guild, user } = ban

  if (guild.id !== SOURCE_GUILD_ID) return

  const targetGuild = client.guilds.cache.get(TARGET_GUILD_ID)
  if (!targetGuild) {
    console.log('Target guild not found')
    return
  }

  try {
    await targetGuild.members.ban(user, { reason: 'Synced ban from source server' })
    console.log(`Banned ${user.tag} in ${targetGuild.name}`)
  } catch (err) {
    console.error(`Failed to ban ${user.tag} in ${targetGuild.name}:`, err)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
