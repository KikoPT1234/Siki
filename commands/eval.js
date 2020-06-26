const Discord = require("discord.js")
const util = require("util")
const fetch = require("node-fetch")

module.exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission(module.exports.help.permission) && msg.member.id !== "200558916365582337") return msg.channel.send("You don't have permission to do this command!")
  if (!args[0]) return msg.channel.send("Please specify a piece of code to run!")
  try {
    const code = args.join(" ")
    let evaled = eval(code)
    if (evaled instanceof Promise) evaled.catch(e => msg.channel.send(`Promise Rejection: ${e.message}`))
    if (typeof evaled != "string") evaled = util.inspect(evaled)
    const embed = new Discord.MessageEmbed()
    .setTitle('Eval - Success')
    .addField('Input', `\`\`\`js\n${code}\`\`\``)
    .addField('Output', `\`\`\`js\n${clean(evaled)}\`\`\``)
    .setColor('GREEN')
    .setAuthor(msg.guild.name, msg.guild.iconURL)
    .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL)
    .setTimestamp()
    msg.channel.send(embed).catch(e => {
      console.log(e)
      msg.channel.send(`:x: An error occurred: ${e}`)
    })
  } catch(e) {
    const code = args.join(" ")
    const embed = new Discord.MessageEmbed()
    .setTitle('Eval - Error')
    .addField('Input', `\`\`\`js\n${code}\`\`\``)
    .addField('Error', `\`\`\`xl\n${clean(e)}\`\`\``)
    .setColor('RED')
    .setTimestamp()
    msg.channel.send(embed).catch(err => {
      console.log(e)
      msg.channel.send(`:x: An error occurred: ${err}`)
    })
  }
}

module.exports.help = {
  name: "evaluate",
  aliases: ["eval"],
  description: "Evaluate a piece of JavaScript code. The Message object is msg and the Client object is client.",
  permission: "MANAGE_GUILD",
  usage: "!evaluate (JavaScript code)"
}

const clean = (text) => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
  }