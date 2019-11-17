const Discord = require('discord.js')

// Create Embed
const createEmbed = (msg, obj) => {
  const embed = new Discord.RichEmbed()
  .setAuthor(msg.guild.name, msg.guild.iconURL)
  .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL)
  .setTimestamp()
  if (obj.title) embed.setTitle(`**${obj.title}**`)
  if (obj.description) embed.setDescription(obj.description)
  if (obj.color) embed.setColor(obj.color)
  else embed.setColor('RANDOM')
  if (obj.fields) obj.fields.forEach(field => {
    if (field.blank) embed.addBlankField(field.inline)
    else embed.addField(field.title, field.value, field.inline)
  })
  if (obj.files) {
    if (Array.isArray(obj.files) && obj.files.length == 1) embed.attachFile(obj.files[0])
    else if (Array.isArray(obj.files) && obj.files.length > 1) embed.attachFiles(obj.files)
    else embed.attachFile(obj.files)
  }
  if (obj.image || obj.img) {
    const img = obj.image || obj.img
    embed.setImage(img)
  }
  if (obj.thumbnail) embed.setThumbnail(obj.thumbnail)
  if (obj.url) embed.setURL(obj.url)
  return embed
}

// Get user and member
const getUserMember = async (client, msg, args) => {
  const user = msg.mentions.users.first() || await client.fetchUser(args[0]).catch(e => {
    console.log(e)
    msg.channel.send(`:x: Failed to get user: **${e}**`)
  })
  if (user.isRejected) return;
  const member = msg.mentions.members.first() || await msg.guild.fetchMember(user.id).catch(e => {
    console.log(e)
    msg.channel.send(`:x: Failed to get member: **${e}**`)
  })
  if (member.isRejected) return;
  return {user, member}
}

module.exports = {
  createEmbed,
  getUserMember
}