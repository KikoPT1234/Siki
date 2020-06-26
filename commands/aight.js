const Discord = require("discord.js")

module.exports.run = async (client, msg, agrs) => {
  const file = new Discord.MessageAttachment("https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2F5e3bd382-e0e1-43c1-be9a-bf3c6553fd4a.image.png?v=1579111732934", "aight.png")
  return msg.channel.send(`${msg.member}:`, file)
}

module.exports.help = {
  name: "aightimmaheadout",
  aliases: ["aight", "aiho", "spongebob"],
  description: "Aight, imma head out"
}