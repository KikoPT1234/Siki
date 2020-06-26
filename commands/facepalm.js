const Discord = require("discord.js")

module.exports.run = async (client, msg, args) => {
  const file = new Discord.MessageAttachment("https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2Ffacepalm.gif?v=1579112179609", "facepalm.gif")
  return msg.channel.send(`${msg.member}:`, file)
}

module.exports.help = {
  name: "facepalm",
  aliases: ["fc", "face"],
  description: "Just a facepalm."
}