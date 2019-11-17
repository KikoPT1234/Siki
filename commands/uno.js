const Discord = require('discord.js')

module.exports.run = async (client, msg, args) => {
  const status = msg.author.presence.status
  let file
  switch (status) {
    case 'online':
      file = new Discord.Attachment('https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FGreen.png?v=1562572571943', 'green.png')
      break
    case 'idle':
      file = new Discord.Attachment('https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FYellow.png?v=1562572565468', 'yellow.png')
      break
    case 'dnd':
      file = new Discord.Attachment('https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FRed.png?v=1562572577510', 'red.png')
      break
    default:
      file = new Discord.Attachment('https://cdn.glitch.com/751421fa-5d9b-40d6-9679-a5d6a54d2de2%2FBlue.png?v=1562572559761', 'blue.png')
  }
  return msg.channel.send(args[0] ? `${msg.member}: No U, ${args.join(' ')}.` : `${msg.member}: No U.`, {
    file
  })
}

module.exports.help = {
  name: 'uno',
  aliases: ['nou', 'no-u', 'noyou', 'no-you', 'reverse', 'reversecard', 'reverse-card'],
  description: 'No U',
  usage: '!uno [member mention or user ID]'
}