const Discord = require('discord.js')
const {getUserMember, createEmbed} = require('../utils.js')

module.exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission(module.exports.help.permission)) return msg.channel.send('You don\'t have permission to do that.')
  if (!args[0]) return msg.channel.send(`Usage: ${module.exports.help.usage}`)
  const reason = args.slice(1).join(' ') || 'No reason provided'
  const {user, member} = await getUserMember(client, msg, args)
  if (!user) return;
  if (!member) return;
  const options = {
    title: 'Ban',
    fields: [{
      title: 'Banned User',
      value: `**${user.tag}** with ID ${user.id}`
    }, {
      title: 'Banned By',
      value: `**${msg.author.tag}** with ID ${msg.author.id}`
    }, {
      title: 'Banned In',
      value: msg.channel
    }, {
      title: 'Banned At',
      value: msg.createdAt
    }, {
      title: 'Reason',
      value: reason
    }]
  }
  const embed = await createEmbed(msg, options)
  const controlChannel = msg.guild.channels.find(c => c.name === 'control-room')
  member.ban(reason).then(() => {
    if (!controlChannel) msg.channel.send(':x: Failed to get control-room.')
    else controlChannel.send(embed).catch(e => {
      console.log(e)
      msg.channel.send(`:x: Failed to notify control room: **${e}**`)
    })
    msg.channel.send(`:white_check_mark: Successfully banned user **${user.tag}**`)
  }).catch(e => {
    console.log(e)
    return msg.channel.send(`:x: Failed to ban user: **${e}**`)
  })
}
module.exports.help = {
  name: 'ban',
  description: 'Ban a user',
  permission: 'BAN_MEMBERS',
  usage: '!ban (member mention or user ID) [reason]'
}