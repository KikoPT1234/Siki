const Discord = require("discord.js")
const fetch = require("node-fetch")

module.exports.run = async (client, msg, args) => {
  const l = await fetch("https://meme-api.herokuapp.com/gimme");
  let le = await l.json();
  le = await JSON.stringify(le)
  le = await JSON.parse(le)
  const embed = await new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle(le.title)
  .setURL(le.postLink)
  .setImage(le.url);
  return msg.channel.send(embed);
}

module.exports.help = {
  name: "meme",
  description: "Sends a random meme (Might contain inappropriate content)",
}