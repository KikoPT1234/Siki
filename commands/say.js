const Discord = require('discord.js')

module.exports.run = async (client, msg, args) => {
  msg.delete(500)
  const message = args.join(' ')
  if (!message) return msg.channel.send(`Usage: ${module.exports.help.usage}`)
  if (args[1] === "**Server") return msg.channel.send("Illegal word found").then(m => m.delete(5000));
  return msg.channel.send(message)
}

module.exports.help = {
  name: 'say',
  description: 'Make me say what you want',
  usage: '!say (message)'
}