const Discord = require("discord.js")
const fetch = require("node-fetch")

module.exports.run = async (client, msg, args) => {
  const r = Math.floor(Math.random() * 50)
  if (r == 49 || args[0] === "honest") {
    const r2 = Math.floor(Math.random() * 2)
    if (r2 == 1) {
      const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setTitle(client.users.get("318922957760102409").username)
      .setImage(client.users.get("318922957760102409").displayAvatarURL)
      return msg.channel.send(embed)
    } else {
      const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setTitle(client.users.get("200558916365582337").username)
      .setImage(client.users.get("200558916365582337").displayAvatarURL)
      return msg.channel.send(embed)
    }
  } else {
    const l = await fetch('https://official-joke-api.appspot.com/jokes/random');
    let le = await l.json();
    le = await JSON.stringify(le)
    le = await JSON.parse(le)
    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField(le.setup, le.punchline)
    return msg.channel.send(embed)
  }
}

module.exports.help = {
  name: "joke",
  description: "Sends a joke"
}