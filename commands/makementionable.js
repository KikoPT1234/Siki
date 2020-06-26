const Discord = require('discord.js')
const {getUserMember, createEmbed} = require('../utils.js')

module.exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission(module.exports.help.permission)) return msg.channel.send("No permission.")
  const role = msg.guild.roles.cache.find(r => r.name === args[0]) || msg.guild.roles.cache.get(args[0])
  if (!role) return msg.channel.send("Role not found.")
  role.setMentionable(true).then(r => {msg.channel.send("Role is now mentionable for 10 seconds").then(m => m.delete({timeout: 5000})), setTimeout(() => {r.setMentionable(false)}, 10000)})
}

module.exports.help = {
  name: 'makementionable',
  description: 'mm',
  permission: 'MANAGE_ROLES',
  usage: '!makementionable (role name or id)',
  aliases: ["mm"]
}