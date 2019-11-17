const Discord  = require('discord.js')
const {getUserMember, createEmbed} = require('../utils.js')

module.exports.run = async (client, msg, args) => {
  if (!args[0]) return msg.channel.send(`Usage: ${module.exports.help.usage}`)
  if (!msg.member.hasPermission(module.exports.help.permission)) return msg.channel.send('You don\'t have permission to do that.')
  const reason = args.slice(1).join(' ') || 'No reason provided'
  const {user, member} = await getUserMember(client, msg, args)
  if (!user) return;
  if (!member) return;
  if (member.hasPermission(module.exports.help.permission)) return msg.channel.send('The member cannot be muted!')
  const options = {
    title: 'Ban',
    fields: [{
      title: 'Muted User',
      value: `**${user.tag}** with ID ${user.id}`
    }, {
      title: 'Muted By',
      value: `**${msg.author.tag}** with ID ${msg.author.id}`
    }, {
      title: 'Muted In',
      value: msg.channel
    }, {
      title: 'Muted At',
      value: msg.createdAt
    }, {
      title: 'Reason',
      value: reason
    }]
  }
  const embed = await createEmbed(msg, options)
  let role = msg.guild.roles.find(c => c.name.toLowerCase() === 'muted' || c.name.toLowerCase === 'mute')
  if (!role) {
    try {
      role = await msg.guild.createRole({
        name: 'Muted',
        color: 'RANDOM',
        permissions: [],
        position: msg.guild.me.highestRole.position - 1
      }).then(muterole => {
        msg.guild.channels.forEach(channel => {
          channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SEND_TTS_MESSAGES: false, 
            ATTACH_FILES: false,
            SPEAK: false
          })
        })
      })
    } catch(e) {
      console.log(e)
      return msg.channel.send(`:x: Unable to create role: **${e}**`)
    }
  }
  member.addRole(role.id).then(() => {
    msg.channel.send(`:white_check_mark: Successfully muted **${user.username}** for: ${reason}`).then(message => message.delete(10000))
    user.send(`Hello, you have been muted in **${msg.guild.name}** for: ${reason}`).catch(e => {
      console.log(e)
      msg.channel.send(`:x: Failed to notify user: **${e}**`)
    })
    const controlChannel = msg.guild.channels.find(c => c.name === 'control-room')
    if (!controlChannel) msg.channel.send(`:x: Failed to obtain control-room channel.`)
    else controlChannel.send(embed)
  })
}

module.exports.help = {
  name: 'mute',
  description: 'Mute a user',
  usage: '!mute (member mention or user ID)',
  permission: 'MANAGE_MESSAGES',
}