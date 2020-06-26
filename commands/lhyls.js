const Discord = require("discord.js")

module.exports.run = async (client, msg, args) => {
  const file = new Discord.MessageAttachment("https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2Flhyls.jpg?v=1579036818318", "lhyls.jpg")
  return msg.channel.send(args[0] ? `${msg.member} to ${args.join(" ")}:` : `${msg.member}:`, file)
}

module.exports.help = {
  name: "listenhereyoulittleshit",
  aliases: ["lhyls", "lys"],
  usage: "!listenhereyoulittleshit [anything]",
  description: "O_O listen here you little shit"
}