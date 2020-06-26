const Discord = require('discord.js')

module.exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission(module.exports.help.permission)) return msg.channel.send('You don\'t have permission to do that.')
  if (!args[0] || args[0] < 1 || args[0] > 100) return msg.channel.send('Usage: !clear (number of messages between 1 and 100)')
  await msg.delete({timeout: 500}).then(() => {
    msg.channel.bulkDelete(args[0]).catch(e => {
      console.log(e)
      return msg.channel.send(`Could not delete one or more messages.\n**${e}**`).then(message => message.delete({timeout: 10000}).catch(() => {}))
    })
    return msg.channel.send(`Deleted ${args[0]} messages.`).then(message => message.delete({timeout: 10000}).catch(() => {}))
  })

}

module.exports.help = {
  name: 'clear',
  aliases: ['clearchat', 'cc'],
  description: 'Clear a set amount of numbers from the chat',
  usage: '!clear (number of messages to clear between 1 and 100)',
  permission: 'MANAGE_MESSAGES'
}