const Discord = require('discord.js')
const {getUserMember, createEmbed} = require('../utils.js')

module.exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission(module.exports.help.permission)) return msg.channel.send('You don\'t have permission to do that.')
  if (!(args[0]) || !(args[1])) return msg.channel.send(`Usage: ${module.exports.help.usage}`)
  const {user, member} = await getUserMember(client, msg, args)
  if (!user) return;
  if (!member) return;
  const role = msg.guild.roles.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || msg.guild.roles.get(args.slice(1).join(' '))
  if (!role) return msg.channel.send(':x: Failed to find role.')
  const options = {
    title: 'Role Add',
    color: '06f702',
    fields: [{
      title: 'Added User',
      value: `**${user.tag}** with ID ${user.id}`
    }, {
      title: 'Added By',
      value: `**${msg.author.tag}** with ID ${msg.author.id}`
    }, {
      title: 'Added Role',
      value: `**${role.name}** with ID ${role.id}`
    }, {
      title: 'Added In',
      value: msg.channel
    }, {
      title: 'Added At',
      value: msg.createdAt
    }]
  }
  const embed = await createEmbed(msg, options)
  const controlChannel = msg.guild.channels.find(c => c.name === 'control-room')
  member.addRole(role.id)
  .then(() => {
    if (!controlChannel) msg.channel.send(':x: Failed to get control-room')
    else controlChannel.send(embed)
    user.send(`You have been given the role **${role.name}** in **${msg.guild.name}**`)
    .catch(e => {
      console.log(e)
      msg.channel.send(`:x: Failed to notify user: **${e}**`)
    })
    msg.channel.send(`:white_check_mark: Successfully added role to **${user.tag}**`)
  })
  .catch(e => {
    console.log(e)
    msg.channel.send(`:x: Failed to add the role: **${e}**`)
  })
}

module.exports.help = {
  name: 'addrole',
  aliases: ['ar'],
  description: 'Add a role to a user',
  usage: '!addrole (member mention or user ID) (role name or ID)',
  permission: 'MANAGE_ROLES'
}