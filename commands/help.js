const Discord = require('discord.js')

module.exports.run = async (client, msg, args) => {
  const page = args[0] || 1
  const numberOfPages = Math.floor(client.commands.size / 20) + 1
  if (page < 1 || page > numberOfPages) return msg.channel.send(`Please specify a number between 1 and ${numberOfPages}, or leave it blank.`)
  const embed = new Discord.RichEmbed()
  .setAuthor(msg.guild.name, msg.guild.iconURL)
  .setTitle(`**Help**`)
  .setDescription(`**Page ${page}/${numberOfPages}**\n() means the argument is needed\n[] means the argument is optional`)
  .setColor('RANDOM')
  .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL)
  .setTimestamp()
  client.commands.array().forEach((command, index) => {
    command.help.pageNumber = Math.floor(index / 20) + 1
    if (command.help.pageNumber !== page) return;
    if (command.help.ignore) return;
    if (command.help.permission && !(msg.member.hasPermission(command.help.permission))) return;
    embed.addField(`${command.help.aliases ? command.help.aliases.length == 1 ? `!${command.help.name}\n*Alias: ${command.help.aliases.join(', ')}*` : `!${command.help.name}\n*Aliases: ${command.help.aliases.join(', ')}*` : `!${command.help.name}`}${command.help.usage ? `\nUsage: ${command.help.usage}` : ''}`, command.help.description || 'This command has no description')
  })
  return msg.author.send(embed).then(() => msg.channel.send('Message sent to DM.').then(message => message.delete(5000))).catch(e => {
    console.log(e)
    msg.channel.send('Failed to DM, sending in public channel.').then(message => {
      message.delete(2000).then(() => {
        msg.channel.send(embed)
      })
    })
  })
}

module.exports.help = {
  name: 'help',
  aliases: ['cmds'],
  description: 'List of commands',
  usage: '!help [page number]',
}