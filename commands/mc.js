const Discord = require('discord.js')
const fetch = require("node-fetch")
const ms = require("ms")

module.exports.run = async (client, msg, args) => {
  if (!args[0]) return msg.channel.send("No username provided")
  msg.channel.startTyping()
  const r = await fetch("https://some-random-api.ml/mc?username=" + args[0])
  let re = await r.json()
  re = await JSON.stringify(re)
  re = await JSON.parse(re)
  const r2 = await fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + re.trimmed_uuid)
  const re2 = await r2.json()
  const r3 = await fetch("https://some-random-api.ml/base64?decode=" + re2.properties[0].value)
  const re3 = await r3.json()
  const semifinal = await JSON.stringify(re3)
  const final = await JSON.parse(semifinal)
  const text = await JSON.parse(final.text)
  const options = {
    title: "Minecraft Search",
    fields: [{
      title: "Username",
      value: re.username
    }, {
      title: "Full UUID",
      value: re.full_uuid
    }, {
      title: "Trimmed UUID",
      value: re.trimmed_uuid
    }, {
      title: "Skin URL",
      value: text.textures.SKIN.url
    }],
    image: text.textures.SKIN.url
  }
  const {createEmbed} = require("../utils.js")
  const embed = await createEmbed(msg, options)
  msg.channel.stopTyping(true)
  return msg.channel.send(embed)
}

module.exports.help = {
  name: 'mcinfo',
  aliases: ["mc", "minecraft", "minecraftinfo"],
  description: "Get a minecraft player's information",
  usage: "!mcinfo (username)"
}